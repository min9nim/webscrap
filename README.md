### webscrap

webscrap is a micro service for url meta information

<br>

### Usage

You can call webscrap api anywhere(CORS supported)

```javascript
fetch('https://webscrap.now.sh/webscrap', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    url: 'https://news.v.daum.net/v/20190910074818849',
  }),
})
  .then((res) => res.json())
  .then(console.log)
```

result is

```
{
  "title": "[날씨] 중북부 강한 비..내일까지 '200mm↑' 호우",
  "image": "https://img1.daumcdn.net/thumb/S1200x630/?fname=https://t1.daumcdn.net/news/201909/10/newsy/20190910074818588qfjf.jpg",
  "desc": "[앵커] 오늘은 중부지방 곳곳에 강한 비가 내리겠습니다. 최고 200mm 이상이 쏟아지겠는데요, 자세한 날씨는 기상캐스터 연결해서 알아보겠습니다. 김지은 캐스터. [캐스터] 네, 말씀하신 대로 오늘은 중부지방에 많은 양의 비가 강하게 쏟아지겠습니다. 이미 이른 새벽부터 세찬 비가 쏟아지면서 중부 곳곳에는 강수가 기록되고 있습니다. 지금까지 인천공항에 4",
  "url": "https://news.v.daum.net/v/20190910074818849"
}
```
