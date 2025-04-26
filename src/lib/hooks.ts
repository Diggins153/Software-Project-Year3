import { useEffect, useState } from "react";

export function useIsMobile(breakpoint = 768) {
    const [ isMobile, setMobile ] = useState(false);

    useEffect(() => {
        const check = () => setMobile(window.innerWidth < breakpoint);

        check();
        window.addEventListener("resize", check);

        return () => window.removeEventListener("resize", check);
    }, [ breakpoint ]);

    return isMobile;
}