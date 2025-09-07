interface WebPageResult {
  title: string;
  url: string;
  text?: string;
}

export interface WebPageContentResult {
  results: WebPageResult[];
  context: string;
}
