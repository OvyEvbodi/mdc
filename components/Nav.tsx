"use client"

import { usePathname } from "next/navigation";
import NextLink from "next/link";
import { NavigationMenu } from "radix-ui";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Session } from "next-auth";
import SignInBtn from "./GoogleSignInBtn";


const Link = ({ ...props }) => {
	const pathname = usePathname();
	const isActive = props.href === pathname;

	return (
		<NavigationMenu.Link asChild active={isActive}>
			<NextLink href={props.href} className="NavigationMenuLink" {...props} />
		</NavigationMenu.Link>
	);
};

const Nav = () => {
  return (
    <NavigationMenu.Root>
		  <NavigationMenu.List className="flex gap-4 md:gap-12">
		  	<NavigationMenu.Item className="hover:text-primary hover:underline">
		  		<Link href="/">Home</Link>
		  	</NavigationMenu.Item>
		  	<NavigationMenu.Item className="hover:text-primary hover:underline">
		  		<Link href="/forms">Forms</Link>
		  	</NavigationMenu.Item>
        <NavigationMenu.Item className="hover:text-primary hover:underline">
		  		<Link href="/forms/responses">Responses</Link>
		  	</NavigationMenu.Item>
        <NavigationMenu.Item className="hover:text-primary hover:underline">
		  		<Link href="/dashboard">Dashboard</Link>
		  	</NavigationMenu.Item>
		  </NavigationMenu.List>
	</NavigationMenu.Root>
  )
};

const UserNav = ({ session }: {session: Session | null}) => {

  return (
    <section className="px-4 md:px-8">
      {
        session ? (
          <div className="flex gap-2">
          {
            session.user?.image && (
              <Avatar>
                <AvatarImage src={session.user?.image} />
                <AvatarFallback>{session.user?.name && session.user?.name[0]}</AvatarFallback>
               </Avatar>
            )
          }
          <div>{session.user?.name}</div>
          </div>
        )
        :
        (
          <div>
            <SignInBtn />
          </div>
        )
      }
    </section>
  )
};

const NavHeader = ({ session }: {session: Session | null}) => {
  return (
    <header className="px-4 text-secondary font-medium flex flex-wrap justify-between items-center">
      <Image src="/mdc-logo.png" width={80} height={80} alt="MDC logo" />
      <Nav />
      <UserNav session={session} />
    </header>
  )
};

export default NavHeader;