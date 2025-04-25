import Navbar from '../Navbar/Navbar'
import Header from '../Header/Header'
import BookmarkList from './BookmarkList'

export default function Bookmarks() {
      useEffect(() => {
        // Scroll to top when component mounts
        window.scrollTo(0, 0);
    
        // Update document title
        document.title = "Trọ đã lưu | Trọ Đà Nẵng";
      }, []);
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