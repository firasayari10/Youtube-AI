"use client"

import { trpc } from "@/trpc/client";


interface CategoriesSectionProps {
    categoryId?:string;
};

export const  CategoriesSection=({}:CategoriesSectionProps)=>{
        const {data:categories} = trpc.categories.getMany.useQuery();

        return (
            <div>
                {JSON.stringify(categories)}
            </div>
        )
}
