import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, User as UiUser } from "@heroui/react";
import { handleGoogleSignOut } from '@/actions/sign-in-action';
import { LogOutIcon, SettingsIcon } from "../icons/svgIcons";

type UserProps = {
    email: string;
    name: string;
    image: string;
    signedAs: string;
}

export default function User({ email, image, name, signedAs }: UserProps) {
    return (
        <div className="flex items-center gap-4">
            <Dropdown 
                placement="right"
                backdrop="transparent"
                classNames={{
                    base: "before:bg-default-200",
                    content:
                      "py-1 px-1 border dark:text-zinc-300 dark:bg-zinc-800 border-default-200 bg-gradient-to-br from-white to-default-200 dark:from-default-50 dark:to-black",
                }}
            >
                <DropdownTrigger>
                <UiUser
                    as="button"
                    avatarProps={{
                        isBordered: false,
                        src: image,
                        color: 'primary'
                    }}
                    className="transition-transform"
                    description={email}
                    name={name}
                />
                </DropdownTrigger>
                <DropdownMenu aria-label="User Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                    <p className="font-bold">Signed in as</p>
                    <p className="font-bold">@{signedAs}</p>
                </DropdownItem>
                <DropdownItem 
                    key="settings"
                    startContent={<SettingsIcon/>}
                >
                    Settings
                </DropdownItem>
                <DropdownItem 
                    key="signOut" 
                    color="danger"
                    startContent={<LogOutIcon />}
                    onPress={handleGoogleSignOut}
                >
                    Sign Out
                </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
    )
}