import Sidebar from '@/components/common/Sidebar';
import { useState, useEffect, ReactNode } from 'react';
import { Progress } from '@heroui/react';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import Footer from '@/components/common/Footer';
import { Locale } from '@/lib/i18n';

const Layout = ({ children }: { children: ReactNode }) => {
    const router = useRouter();
    const [isCollapsed, setIsCollapsed] = useState(true);
    const { data: session, status } = useSession();
    const [value, setValue] = useState(0);
    const { locale } = router;

    useEffect(() => {
        if (status === "loading") return;

        if (status === "authenticated") {
            if (session?.user.role === "guest") {
                // signOut({ redirect: false });
                router.push("/access-denied");
            } else if (!session?.user.groups?.includes("admin")) {
                if (router.pathname.startsWith('/settings')) {
                    router.push("/access-denied");
                }
            }
        } else {
            router.push("/sign-in");
        }
    }, [status, session, router]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('sidebarState');
            if (saved) {
                setIsCollapsed(JSON.parse(saved));
            }
        }
    }, []);

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
            status === 'authenticated' && session?.user.role !== "guest" ?
            (<div className="dark:text-foreground dark:bg-zinc-900 relative flex h-screen bg-gray-100">
                <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} locale={locale as Locale} />
                <div
                    className={`flex-1 ${isCollapsed ? 'ml-10' : 'ml-60'} transition-all duration-500 ease-in-out p-6 pl-10`}
                >
                    <div className="dark:text-foreground dark:bg-zinc-800 bg-white shadow-lg rounded-2xl p-6 h-full overflow-auto scrollbar-hide">
                        {children}
                    </div>
                </div>
                <div
                    className="absolute bottom-0 left-1 transition-all duration-500 ease-in-out"
                >
                    <Footer locale={locale as Locale} />
                </div>
            </div>) : <>{children}</>}
        </div>
    );
};

export default Layout;
