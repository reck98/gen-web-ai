import { useEffect } from "react";
import axios from "axios";
import { serverURL } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

function useGetCurrentUser() {
    const dispatch = useDispatch();
    useEffect(() => {
        const getCurrentUser = async () => {
            try {
                const user = await axios.get(`${serverURL}/api/user/me`, {
                    withCredentials: true,
                });

                dispatch(setUserData(user.data));
                // console.log(user);
            } catch (error) {
                console.log(error);
            }
        };

        getCurrentUser();
    }, [dispatch]);
}

export default useGetCurrentUser;
