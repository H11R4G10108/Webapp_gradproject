import {
    HomeIcon as HomeIconOutline,
    BookmarkIcon as BookmarkIconOutline,
    Cog6ToothIcon as Cog6ToothIconOutline,
    SparklesIcon as SparklesIconOutline,
    ArrowLeftOnRectangleIcon as ArrowLeftOnRectangleIconOutline,
} from '@heroicons/react/24/outline';
import {
    HomeIcon as HomeIconSolid,
    BookmarkIcon as BookmarkIconSolid,
    Cog6ToothIcon as Cog6ToothIconSolid,
    SparklesIcon as SparklesIconSolid,
    ArrowLeftOnRectangleIcon as ArrowLeftOnRectangleIconSolid,
} from '@heroicons/react/24/solid';

export const SidebarData = [
    { id: '1', title: 'Home', path: '/', iconOutline: <HomeIconOutline className="h-5 w-5 mr-2" />, iconSolid: <HomeIconSolid className="h-5 w-5 mr-2" /> },
    { id: '2', title: 'Crawl bot', path: '/crawl-bot', iconOutline: <SparklesIconOutline className="h-5 w-5 mr-2" />, iconSolid: <SparklesIconSolid className="h-5 w-5 mr-2" /> },
    { id: '3', title: 'Bookmarks', path: '/bookmarks', iconOutline: <BookmarkIconOutline className="h-5 w-5 mr-2" />, iconSolid: <BookmarkIconSolid className="h-5 w-5 mr-2" /> },
    { id: '4', title: 'Settings', path: '/settings/account-information', iconOutline: <Cog6ToothIconOutline className="h-5 w-5 mr-2" />, iconSolid: <Cog6ToothIconSolid className="h-5 w-5 mr-2" /> },
]