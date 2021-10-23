/* eslint-disable jsx-a11y/alt-text */
import styles from "../Header/styles.module.scss";
import { SignInButton } from "../SignInButton";
// Otimizando  imagens com next-imag
import Image from 'next/image'

import { ActiveLink } from '../ActiveLink';

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
      
     <Image src='/images/logo.svg'
     width={100}
     height={100}
     />
         <nav>
                    <ActiveLink activeClassName={styles.active}  href="/">
                        <a>Home</a>
                    </ActiveLink>
                    <ActiveLink activeClassName={styles.active} href="/posts" prefetch>
                        <a>Posts</a>
                    </ActiveLink>
                </nav>

        
        <SignInButton />
        </div>
    </header>
  );
}
