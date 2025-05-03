import PostList from './PostList'
import Navbar from '../Navbar/Navbar'
export default function Home() {
    return (
            <div className='flex flex-col w-full'>
                <Navbar />
                <div> 
                    <PostList />
                </div>
                </div>
    )
}