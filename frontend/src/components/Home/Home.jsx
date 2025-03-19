import Sidebar from '../Sidebar/Sidebar'
import Header from '../Header/Header'
import PostList from './PostList'

export default function Home() {

    return (
        <div className="flex ">
            <Sidebar />
            <div className='flex flex-col w-full'>
                <Header />
                <div className="bg-slate-100"> 
                    <PostList />
                </div>
                </div>
        </div>
    )
}