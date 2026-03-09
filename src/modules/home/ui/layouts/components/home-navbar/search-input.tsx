import { APP_URL } from "@/constants";
import { SearchIcon } from "lucide-react"
import { useRouter } from "next/navigation";
import { useState } from "react"

export const SearchInput = ()=>{
    const router = useRouter();
    const [value , setValue] = useState("");

    const handleSearch = (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        const url= new URL("/search",APP_URL);
        const newQuery = value.trim();
        url.searchParams.set("query", encodeURIComponent(newQuery));

        if(newQuery === "")
        {
            url.searchParams.delete("query");

        }

        setValue(newQuery);
        router.push(url.toString());





    }



    return (
        <form className="flex w-full max-w-[600px]">
            <div className="relative w-full">
                <input type="text" placeholder="Search" className="w-full pl-4 py-2 pr-12 rounded-l-full border focus:outline-none focus:border-blue-500"/>

            </div>
            <button type="submit" className="px-5 py-2.5 bg-gray-100 border border-l-0 rounded-r-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">
                <SearchIcon className="size-5" />

            </button>

        </form>
    )
}