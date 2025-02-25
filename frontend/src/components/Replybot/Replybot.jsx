import Sidebar from '../Sidebar/Sidebar'
import Header from '../Header/Header'
export default function Replybot() {

    return (
        <div className="flex ">
            <Sidebar />
            <div className='flex flex-col w-full'>
                <Header />
                <div className="flex justify-center items-center w-auto bg-slate-100"> 
                </div>
                </div>
        </div>
    )
}