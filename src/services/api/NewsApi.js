export const getNewsID = async () => {
  try {
    const res = await fetch(
      `https://newsapi.org/v2/top-headlines?country=id&apiKey=${
        import.meta.env.VITE_API_NEWS
      }`
    );
    const JsonType = await res.json();

    return JsonType;
  } catch (error) {
    console.log(`error from getNewsId ${error.message}`);
  }
};
