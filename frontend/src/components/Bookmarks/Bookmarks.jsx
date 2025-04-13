import Navbar from '../Navbar/Navbar'
import Header from '../Header/Header'
import BookmarkList from './BookmarkList'

export default function Bookmarks() {
    return (
            <div className='flex flex-col w-full'>
                <Navbar />
                <div className="bg-slate-100">
                    <BookmarkList
                    />               
                    </div>
        </div>
    )
}