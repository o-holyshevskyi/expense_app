import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, User as UiUser } from "@heroui/react";
import { handleGoogleSignOut } from '@/actions/sign-in-action';
import { LogOutIcon, SettingsIcon } from "../icons/svgIcons";
import { useSession } from "next-auth/react";

type UserProps = {
  email: string;
  name: string;
  image: string;
  signedAs: string;
};

const userDropDownItems = (signedAs: string, group: string[]) => [
    {
        key: 'profile',
        color: undefined as "danger" | "default" | "primary" | "secondary" | "success" | "warning" | undefined,
        startContent: <></>,
        onPress: () => {},
        assignedGroups: ["admin", "user"],
        child: 
        <>
            <p className="font-bold">{signedAs} signed in as</p>
            <p className={`
                text-tiny font-bold items-center justify-center 
                ${group.includes('admin') ? 'text-green-400' : 'text-amber-800'}
            `}>
                @{group.join(', ')}
            </p>
        </>,
    },
    {
        key: 'settings',
        color: undefined as "danger" | "default" | "primary" | "secondary" | "success" | "warning" | undefined,
        startContent: <SettingsIcon />,
        onPress: () => alert("Settings clicked"), // Placeholder action
        assignedGroups: ["admin"],
        child: 'Settings',
    },
    {
        key: 'signOut',
        color: 'danger' as "danger" | "default" | "primary" | "secondary" | "success" | "warning" | undefined,
        startContent: <LogOutIcon />,
        onPress: handleGoogleSignOut,
        assignedGroups: ["admin", "user"],
        child: 'Sign Out',
    },
];

export default function User({ email, image, name, signedAs }: UserProps) {
  const { data: session } = useSession();
  const userGroups = session?.user?.groups || [];

  // Filter dropdown items based on the user's groups
  const filteredItems = userDropDownItems(signedAs, userGroups).filter(item =>
    item.assignedGroups.some(group => userGroups.includes(group))
  );

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
              color: 'primary',
            }}
            className="transition-transform"
            description={email}
            name={name}
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="User Actions" variant="flat">
            {filteredItems.map(ddItem => (
                <DropdownItem
                    key={ddItem.key}
                    color={ddItem.color}
                    startContent={ddItem.startContent}
                    onPress={ddItem.onPress}
                >
                    {ddItem.child}
                </DropdownItem>
            ))}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
