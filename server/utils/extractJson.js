const extractJson = async (raw) => {
    if (!raw) return null;

    const cleaned = raw
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

    const firstBracket = cleaned.indexOf("{");
    const lastBracket = cleaned.lastIndexOf("}");

    if (firstBracket === -1 || lastBracket === -1) return null;

    const jsonStirng = cleaned.slice(firstBracket, lastBracket + 1);

    return JSON.parse(jsonStirng);
};

export default extractJson;
