"use client"

import { trpc } from "@/trpc/client";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { FilterCarousel } from "@/components/filter-carousel";


interface CategoriesSectionProps {
    categoryId?:string;
};

export const CategoriesSection  =({categoryId}:CategoriesSectionProps )=>{
    return (
        <Suspense fallback={
            <p>
                Loading ....
            </p>
        } >
            <ErrorBoundary fallback={<p>Loading .... </p> }>
                <CategoriesSectionSuspense categoryId={categoryId} />
            </ErrorBoundary>

        </Suspense>
    )
}

 const  CategoriesSectionSuspense=({categoryId}:CategoriesSectionProps)=>{
       //const {data:categories} = trpc.categories.getMany.useSuspenseQuery();
        
       const [categories] = trpc.categories.getMany.useSuspenseQuery();
        const data = categories.map(({name, id})=> ({
            value:id,
            label:name
        }))
        return <FilterCarousel   data={data}/>
}
