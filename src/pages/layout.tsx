import Sidebar from '@/components/common/Sidebar';
import { useState, useEffect, ReactNode } from 'react';
import { Avatar, Progress, Image } from '@heroui/react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Footer from '@/components/common/Footer';
import { ThemeSwitcher } from '@/components/theme/ThemeSwitcher';

const Layout = ({ children }: { children: ReactNode }) => {
    const router = useRouter();
    const [isCollapsed, setIsCollapsed] = useState(true);
    const { data: session, status } = useSession();
    const [value, setValue] = useState(0);

    useEffect(() => {
        if (status === "loading") return; // Wait for session to load
        if (!session) {
            router.push("/sign-in"); // Redirect to signin if no session
        }
        
        console.log(session?.user?.image)

        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('sidebarState');
            if (saved) {
                setIsCollapsed(JSON.parse(saved));
            }
        }
    }, [status, session, router]);

    useEffect(() => {
        const interval = setInterval(() => {
          setValue((v) => (v >= 100 ? 0 : v + 10));
        }, 500);
    
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            {status === "loading" ? 
            (
                <div className='dark:text-foreground dark:bg-zinc-900 flex justify-center items-center h-screen'>
                    <Progress
                        aria-label="Downloading..."
                        className="max-w-md"
                        color="success"
                        showValueLabel={false}
                        size="lg"
                        isStriped={true}
                        value={value}
                    />
                </div>
            ) :
            status === 'authenticated' ?
            (<div className="dark:text-foreground dark:bg-zinc-900 relative flex h-screen bg-gray-100">
                <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
                <div
                    className={`flex-1 ml-${isCollapsed ? '10' : '60'} transition-all duration-500 ease-in-out p-6 pl-10`}
                >
                    <div className="dark:text-foreground dark:bg-zinc-800 bg-white shadow-lg rounded-2xl p-6 h-full overflow-auto scrollbar-hide">
                        {children}
                    </div>
                </div>
                <div
                    className="absolute bottom-0 left-1 transition-all duration-500 ease-in-out"
                >
                    <Footer />
                </div>
            </div>) : <></>}
        </div>
    );
};

export default Layout;
