import Sidebar from '../Sidebar/Sidebar'
import Header from '../Header/Header'
import BookmarkList from './BookmarkList'
import PostList from '../Home/PostList'
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";


export default function Bookmarks() {
    const { user } = useContext(AuthContext);
    const user_id = user ? user.user_id : null;
    return (
        <div className="flex ">
            <Sidebar />
            <div className='flex flex-col w-full'>
                <Header />
                <div className="bg-slate-100">
                    <BookmarkList
                    />               
                    </div>
            </div>
        </div>
    )
}