import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  async function getdata():Promise<string>{
    const data = await fetch("http://localhost:8080/")
    return await data.text();
    
  }
  return (
    <main className={styles.main}>
      <p>{getdata()}</p>
    </main>
  );
}
