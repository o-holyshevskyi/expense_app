import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { navItems } from '../../shared/nav-items';

import {
    LogoIcon,
    HomeIcon,
    SidebarIcon,
} from "../icons/svgIcons";
import { Button, Kbd, Tooltip } from '@heroui/react';
import User from './User';
import { useSession } from 'next-auth/react';
import { ThemeSwitcher } from '../theme/ThemeSwitcher';

type SidebarProps = {
    isCollapsed: boolean;
    setIsCollapsed: (update: (prev: boolean) => boolean) => void;
};

const Sidebar = ({ isCollapsed, setIsCollapsed }: SidebarProps) => {
    const router = useRouter();
    const { pathname } = router;
    const { data: session } = useSession();

    const topSidebarMenuItems = [
        { href: '/', label: 'Home', icon: <HomeIcon />, id: 'home', isDisplayed: isCollapsed },
        ...navItems,
    ];

    const bottomSidebarMenuItems = [
        {
            reactElement: <ThemeSwitcher />,
            id: 'themeSwithcer'
        },
        { 
            reactElement: <User
                email={!isCollapsed && session?.user?.email || ''}
                name={!isCollapsed && session?.user?.name || ''}
                image={session?.user?.image || ''}
                signedAs={session?.user?.name || ''}
            />, 
            id: 'user' 
        }
    ];

    useEffect(() => {
        const saved = localStorage.getItem('sidebarState');
        if (saved) {
            setIsCollapsed(JSON.parse(saved));
        }
    
        const handleKeyPress = (event: KeyboardEvent) => {
            if (
                document.activeElement?.tagName !== 'INPUT' &&
                document.activeElement?.tagName !== 'TEXTAREA'
            ) {
                if (event.key === '[') {
                    handleIsCollapsed();
                }
            }
        };
    
        window.addEventListener('keydown', handleKeyPress);
    
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [isCollapsed, setIsCollapsed]);
    

    const handleIsCollapsed = () => {
        setIsCollapsed((prev: boolean) => {
            const newState = !prev;
            if (typeof window !== 'undefined') {
                localStorage.setItem('sidebarState', JSON.stringify(newState));
            }
            return newState;
        });
    };

    const isActive = (href: string): boolean => {
        if (pathname === href) {
            return true;
        }
        if (pathname.startsWith('/execution-result') && href === '/test-execution-results') {
            return true;
        }
        if (pathname.startsWith('/running-tests') && href === '/tests') {
            return true;
        }
        return false;
    };

    return (
        <div
            className={`text-default-900 transition-all duration-500 ease-in-out transform ${isCollapsed ? 'w-20' : 'w-60'} fixed top-0 left-0 h-full`}
            style={{ width: isCollapsed ? '5rem' : '17rem', backgroundColor: 'var(--color-default-900)' }}
        >
            <nav id="sidebar" className="flex flex-col justify-between h-full">
                <div className='dark:text-zinc-300 rounded-2xl m-2 mt-6 flex flex-col justify-center'>
                    <div className="flex h-16 items-center font-bold text-center justify-between gap-2 px-3">
                        {!isCollapsed ?
                            <Link href="/" className="transform transition-transform duration-300 hover:scale-105 flex items-center gap-2 p-2">
                                <LogoIcon />
                                <p>Expense App</p>
                            </Link>
                        : null}
                        <Tooltip 
                            placement='right' 
                            className='dark:text-zinc-300' 
                            content={
                                <p className='flex flex-row items-center'>
                                    {isCollapsed ? 'Expand' : 'Collapse'} sidebar &nbsp;
                                <Kbd>{"["}</Kbd></p>}
                        >
                            <Button onPress={handleIsCollapsed} size="md" isIconOnly variant="light" color="primary">
                                <SidebarIcon />
                            </Button>
                        </Tooltip>
                        
                    </div>
                    <ul className="mt-4 px-2">
                        {topSidebarMenuItems.map((menuItem) => (
                            menuItem.isDisplayed && 
                            <li 
                                key={menuItem.id} 
                                className={`group mb-2 transition-all flex cursor-pointer items-center rounded-lg 
                                    ${isActive(menuItem.href) ? 'dark:bg-zinc-900 bg-sky-200' : ''} transition-transform duration-500 ease-in-out
                                    box-border rounded-lg border border-transparent hover:dark:bg-zinc-800 hover:bg-sky-200`} style={{ height: '3rem' }}
                            >
                                <Link href={menuItem.href} className="flex items-center gap-2 p-1">
                                    {menuItem.icon}
                                    {!isCollapsed && <span className="text-default-900 font-bold">{menuItem.label}</span>}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className='dark:text-zinc-300 dark:bg-zinc-800 bg-white shadow-lg rounded-2xl m-2 mb-6 flex flex-col justify-center'>
                    <ul className="m-2">
                        {bottomSidebarMenuItems.map((menuItem) => (
                            <li 
                                key={menuItem.id} 
                                className={`p-[3px] group transition-all flex cursor-pointer items-center rounded-lg
                                    transition-transform duration-500 ease-in-out
                                    box-border rounded-lg border border-transparent hover:dark:bg-zinc-900 hover:bg-sky-200`} style={{ height: '3rem' }}
                            >
                                {menuItem.reactElement}
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
