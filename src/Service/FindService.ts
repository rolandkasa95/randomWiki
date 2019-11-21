import fetch from "node-fetch";

export class FindService {

    public static getOneRandom = async (passedNumber?: number): Promise<any> => {
        let resultJson;
        const pageId: number = passedNumber || FindService.generateNumber();

        try {
            const url = `https://en.wikipedia.org/w/api.php?action=query&prop=info&pageids=${pageId}&inprop=url&format=json`;
            const result = await fetch(url);
            resultJson = await result.json();
        } catch (e) {
            return await FindService.getOneRandom(passedNumber);
        }

        const parseble = resultJson.query.pages[pageId];
        if (parseble.hasOwnProperty("missing")) {
            return await FindService.getOneRandom(passedNumber);
        }

        return Promise.resolve(parseble);
    }

    public static getOneFromCategory = async (category: string): Promise<object> => {
        let resultJson;

        try {
            let url = `https://en.wikipedia.org/w/api.php?action=query&format=json&list=allcategories&acfrom=${category}&acprop=size`;
            let result = await fetch(url);
            resultJson = await result.json();
            const parseble = resultJson.query.allcategories;
            const data = FindService.fixedEncodeURIComponent(
                parseble[FindService.generateNumberLimited(parseble.length)]["*"]
            );
            url = `https://en.wikipedia.org/w/api.php?action=query&format=json&list=categorymembers&cmtitle=Category:${data}&cmlimit=20&cmsort=timestamp`;
            result = await fetch(url);
            resultJson = await result.json();
            const pageId = resultJson.query.categorymembers[
                FindService.generateNumberLimited(resultJson.query.categorymembers.length)].pageid;
            return await FindService.getOneRandom(pageId);
        } catch (e) {
            return await FindService.getOneFromCategory(category);
        }
    }

    public static generateNumber = (): number => {
        return parseInt((Math.random() * 60000000).toString(), 10);
    }

    public static generateNumberLimited = (top: number): number => {
        return parseInt((Math.random() * top).toString(), 10);
    }

    public static fixedEncodeURIComponent(str: string): string {
        return encodeURIComponent(str).replace(/[!'()*]/g, (c) => {
            return "%" + c.charCodeAt(0).toString(16);
        });
    }

}
