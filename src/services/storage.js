```javascript
const PREFIX = "mohandessino_";

export function saveData(key, data) {
  localStorage.setItem(
    PREFIX + key,
    JSON.stringify(data)
  );
}

export function getData(key, defaultValue = null) {
  const data = localStorage.getItem(PREFIX + key);

  if (!data) {
    return defaultValue;
  }

  try {
    return JSON.parse(data);
  } catch {
    return defaultValue;
  }
}

export function removeData(key) {
  localStorage.removeItem(PREFIX + key);
}

export function clearAllData() {
  Object.keys(localStorage)
    .filter((key) => key.startsWith(PREFIX))
    .forEach((key) => {
      localStorage.removeItem(key);
    });
}
```