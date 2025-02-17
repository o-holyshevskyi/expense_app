import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react';
import { useRouter } from 'next/router';
import { LanguageIcon } from '../icons/svgIcons';
import { useState } from 'react';

const LanguageSwitcher = ({ translatedSideBarLabel }: { translatedSideBarLabel: string } ) => {
  const router = useRouter();
  const { locale } = router;

  const [selectedKeys, setSelectedKeys] = useState(locale);

  const handleLocaleChange = (newLocale: string) => {
    if (locale !== newLocale) {
      setSelectedKeys(newLocale);
      router.push(router.asPath, router.asPath, { locale: newLocale });
    }
  };

  const allLocales = [
    { label: 'English', value: 'en' },
    { label: 'Українська', value: 'uk' },
  ];

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
          <Button className='ml-1' size='sm' isIconOnly={true} startContent={<LanguageIcon />} />
        </DropdownTrigger>
        <DropdownMenu 
          aria-label="User Actions" 
          variant="flat"
          selectedKeys={selectedKeys}
          disabledKeys={[selectedKeys as string]}
        >
          {allLocales.map(item => (
            <DropdownItem
              key={item.value}
              onPress={() => handleLocaleChange(item.value)}
            >
              {item.label}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
      {translatedSideBarLabel}
    </div>
  );
};

export default LanguageSwitcher;
