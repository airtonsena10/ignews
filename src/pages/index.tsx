import Head from 'next/head'
import React from 'react';
import styles from '../styles/home.module.scss';

export default function Home() {
  return (
    <>
    
        <Head>
            <title>Home | ig.news</title>
        </Head>
        <main className={styles.contentContainer}>
            <section className={styles.hero}>
                <span>👏 Hey, welcome</span>
                <h1>News about the <span>React</span> world</h1>
                <p>
                    Get access to all the publications <br />
                    </p>
                    
                
                    </section>
                    
        </main>

    </>

  )
}
