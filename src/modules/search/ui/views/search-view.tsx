import { CategoriesSection } from "@/modules/search/ui/section/category-section";
import { ResultsSeection } from "../section/results-section";

interface PageProps{
        query:string|undefined ;
        categoryId:string|undefined;

}


export const SearchView =({
    query,
    categoryId
}:PageProps)=>{
    return (
        <div className="max-w-[1300px] mx-auto mb-10 flex flex-col gap-y-6 px-4 pt-2.5">
            <CategoriesSection  categoryId={categoryId}/>
            <ResultsSeection  query={query} categoryId={categoryId}/>

        </div>
    )
}