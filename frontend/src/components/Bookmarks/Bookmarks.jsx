import Sidebar from '../Sidebar/Sidebar'
import Header from '../Header/Header'
import BookmarkList from './BookmarkList'

export default function Bookmarks() {
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