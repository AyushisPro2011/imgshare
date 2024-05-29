
import SidebarItem from "./SidebarItem"
import styles from "./sidebar.module.css"

export default function Sidebar(){
    return(
        <div className={styles.main}>
            <SidebarItem/>
        </div>
    )
}