import {
    defaultShouldDehydrateQuery,
    QueryClient
} from "@tanstack/react-query"
import superjson from "superjson"

export function makeQueryClient(){
    return new QueryClient({
        defaultOptions:{
            queries:{
                staleTime: 30 * 1000,
                refetchOnWindowFocus: false, 
                retry: 1,
            },
            dehydrate:{
                shouldDehydrateQuery:(query)=>
                    defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
                serializeData: superjson.serialize,
            },
            hydrate:{
                deserializeData: superjson.deserialize
            }

        }
    })
}