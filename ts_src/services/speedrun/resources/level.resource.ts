import { Links } from "./links.resource";
import { Category } from "./category.resource";
import { Variable } from "./variable.resource";

export interface Level {
    id:                     string;
    name:                   string;
    weblink:                string;
    rules:                  string;
    links:                  Links[];

    categories?:            {data: Category[]};
    variables?:             {data: Variable[]};
}

