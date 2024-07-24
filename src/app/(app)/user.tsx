"use client";
import { Button } from '@/components/ui/button';
import { useSession, signOut } from 'next-auth/react';
import { User } from 'next-auth';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';

export function UserWidget() {
  const { data: session } = useSession();
  const user: User = session?.user;
  const { toast } = useToast();
  const handleSignOut = async () => {
    await signOut();
    toast({
      title: 'Success',
      description: 'User signing out',
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="overflow-hidden rounded-full"
        >
          <Image
            src={user?.image ?? '/placeholder-user.jpg'}
            width={36}
            height={36}
            alt="Avatar"
            className="overflow-hidden rounded-full"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuSeparator />


        {user ? (
          <DropdownMenuItem>
            <Button onClick={() => {
              signOut();
              toast({
                title: 'Success',
                description: 'User signing out',
              });
            }} className="w-full md:w-auto bg-slate-100 text-black" variant='outline'>
              Logout
            </Button>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem>
            <Link href="/sign-in">Sign In</Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
