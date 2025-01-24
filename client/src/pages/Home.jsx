import { useRecoilState } from 'recoil';
import Dialog from '../components/DialogBox';
import React from 'react'
import { userNameAtom } from '../store/userAtoms';

const Home = () => {
    const [userName, setUserName] = useRecoilState(userNameAtom);
    return (
        <div>
            <div className="flex justify-center border-2 border-indigo-500 py-5 w-full h-[200px] box-content">
                <div className="border-5 border-black">
                    Welcome to CapX, {userName}
                </div>
                <Dialog />
            </div>
            <div>
                Portfolios 
            </div>
        </div>
    )
}

export default Home;