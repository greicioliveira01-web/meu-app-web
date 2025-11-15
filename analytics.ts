export interface AnalyticsData {
  wins: number;
  losses: number;
}

const getAnalyticsKey = (username: string): string => `nexon_analytics_${username}`;

export const getAnalyticsData = (username: string): AnalyticsData => {
  try {
    const dataJson = localStorage.getItem(getAnalyticsKey(username));
    if (dataJson) {
      const data = JSON.parse(dataJson);
      // Basic validation to ensure data integrity
      if (typeof data.wins === 'number' && typeof data.losses === 'number') {
        return data;
      }
    }
  } catch (error) {
    console.error('Failed to parse analytics data from localStorage:', error);
  }
  // Return a default object if no valid data is found
  return { wins: 0, losses: 0 };
};

const saveAnalyticsData = (username: string, data: AnalyticsData) => {
  try {
    const dataJson = JSON.stringify(data);
    localStorage.setItem(getAnalyticsKey(username), dataJson);
  } catch (error) {
    console.error('Failed to save analytics data to localStorage:', error);
  }
};

export const recordWin = (username: string): void => {
  if (!username) return;
  const currentData = getAnalyticsData(username);
  const newData = { ...currentData, wins: currentData.wins + 1 };
  saveAnalyticsData(username, newData);
};

export const recordLoss = (username:string): void => {
  if (!username) return;
  const currentData = getAnalyticsData(username);
  const newData = { ...currentData, losses: currentData.losses + 1 };
  saveAnalyticsData(username, newData);
};
