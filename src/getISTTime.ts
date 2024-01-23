type GetISTTime = [string, number, Date]
export const getISTTime = (): GetISTTime => {
    // Generate date and hour string for Email subject
    const utc = new Date(new Date().toUTCString());
    // Add +5:30 to UTC time to match IST
    const IST = utc.getTime() + (5.5 * 60 * 60 * 1000)
    const now = new Date(IST);
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hour = now.getHours();
    return [`${year}-${month}-${day} till ${hour}'th Hour`, hour, now];
}