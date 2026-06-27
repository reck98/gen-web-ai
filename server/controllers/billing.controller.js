import { FRONTEND_URL } from "../utils/config.js";
import { PLANS } from "../utils/plan.js";
import stripe from "../utils/stripe.js";

export const billing = async (req, res) => {
    try {
        const { planType } = req.body;
        const userId = req.user._id;
        const plan = PLANS[planType];
        if (!plan || plan.price === 0) {
            return res.status(400).json({ message: "Invalid plan type" });
        }

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: `GenWeb.ai ${planType.toUpperCase()} plan`,
                        },
                        unit_amount: plan.price * 100,
                    },
                    quantity: 1,
                },
            ],

            metadata: {
                userId: userId.toString(),
                credits: plan.credits,
                plan: plan.plan,
            },

            success_url: `${FRONTEND_URL}`,
            cancel_url: `${FRONTEND_URL}/pricing`,
        });

        return res.status(200).json({ sessionUrl: session.url });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: `Billing Error : ${error}`,
        });
    }
};
