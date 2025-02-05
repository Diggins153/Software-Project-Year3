import Link from "next/link";

export default function RootPage() {
    return <>
        <h1>How did you get here???</h1>
        <p>Well... that is embarrassing, you were not supposed to see this page.</p>
        <p>If you know you're logged in <Link href="/characters">Go here</Link></p>
        <p>If you know you're NOT logged in <Link href="/login">Go here</Link></p>
        <p>You should be able to find your way from there.</p>
    </>;
}
