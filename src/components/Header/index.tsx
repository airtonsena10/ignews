/* eslint-disable jsx-a11y/alt-text */
import styles from "../Header/styles.module.scss";
import { SignInButton } from "../SignInButton";
// Otimizando  imagens com next-imag
import Image from 'next/image'

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
      
     <Image src='/images/logo.svg'
     width={100}
     height={100}
     />
        <nav>
          <a className={styles.active}>Home</a>
          <a>Post</a>
        </nav>
        
        <SignInButton />
        </div>
    </header>
  );
}
