// Calm, Step-by-Step 10-Stage Guided Tutor (Duolingo-style, 1 bite-sized card at a time)
// Designed so a totally overwhelmed student can go from 0 -> Pass Final Exam step by step!

const GUIDED_STAGES = [
  {
    id: 1,
    emoji: '⭕',
    title: 'ด่าน 1: มองแค่ "ชั้นล่างสุด" ของตัวอักษร',
    subtitle: 'รู้เรื่องนี้แค่เรื่องเดียว = ทำข้อสอบได้ทันทีเกือบ 10 ข้อ!',
    lessonHTML: `
      <p>ไม่ต้องกลัวภาษาเกาหลีเลยครับ! กฎแรกง่ายมาก แค่มอง <strong>"ตัวอักษรตัวสุดท้าย"</strong> เหมือนดูตึก 2 ชั้น:</p>
      <div class="g-compare">
        <div class="g-box g-teal">
          <div class="g-big kr">학<span class="hl">생</span></div>
          <div>ข้างล่างมีตัว <strong class="kr">ㅇ</strong> รองอยู่ = <strong>มีฐาน (มีตัวสะกด)</strong></div>
          <div class="g-rule">👉 เติมตัวที่ขึ้นต้นด้วย <strong>วงกลม ㅇ</strong>:<br/>
            <button class="speak-chip" onclick="speak('학생이에요')">🔊 이에요</button>
            <button class="speak-chip" onclick="speak('학생이')">🔊 이</button>
            <button class="speak-chip" onclick="speak('학생은')">🔊 은</button>
            <button class="speak-chip" onclick="speak('라면을')">🔊 을</button>
          </div>
        </div>
        <div class="g-box g-coral">
          <div class="g-big kr">의<span class="hl">사</span></div>
          <div>ข้างล่าง <strong>โล่งๆ</strong> ไม่มีตัวรอง = <strong>ไม่มีตัวสะกด</strong></div>
          <div class="g-rule">👉 เติมตัวที่ <strong>ไม่มีวงกลม</strong>:<br/>
            <button class="speak-chip" onclick="speak('의사예요')">🔊 예요</button>
            <button class="speak-chip" onclick="speak('의자가')">🔊 가</button>
            <button class="speak-chip" onclick="speak('저는')">🔊 는</button>
            <button class="speak-chip" onclick="speak('사과를')">🔊 를</button>
          </div>
        </div>
      </div>
    `,
    checks: [
      {
        q: 'ลองดูคำว่า "선생님" (คุณครู) — ตัวสุดท้าย 님 มีตัว ㅁ อยู่ข้างล่างไหม? ควรเติมอะไร?',
        opts: ['은 (มีฐาน → เอาวงกลม ㅇ มารับ)', '는 (ข้างล่างโล่ง)'],
        ans: 0,
        okMsg: 'เก่งมาก!! 님 มี ㅁ รองอยู่ข้างล่าง เลยใช้วงกลม ㅇ → 선생님은!',
        hint: 'ลองมองข้างล่างตัว 님 สิครับ มีสี่เหลี่ยม ㅁ รองอยู่ข้างล่าง → เอาวงกลม ㅇ มารับเลย!',
        audio: '선생님은'
      },
      {
        q: 'แล้วคำว่า "사과" (แอปเปิ้ล) — ตัวสุดท้าย 과 ข้างล่างโล่งๆ ไม่มีตัวสะกด ควรเติมอะไร?',
        opts: ['을 (มีฐาน)', '를 (ข้างล่างโล่ง)'],
        ans: 1,
        okMsg: 'เยี่ยมเลย!! 과 ข้างล่างโล่ง ไม่มีตัวสะกด เลยใช้ 를 → 사과를!',
        hint: 'ดูข้างล่างตัว 과 ไม่มีตัวอะไรรองเลย → เลือกตัวที่ไม่มีวงกลม (를) ครับ!',
        audio: '사과를'
      }
    ]
  },
  {
    id: 2,
    emoji: '👋',
    title: 'ด่าน 2: แนะนำตัว — "เป็น / คือ" (이에요 / 예요)',
    subtitle: 'แค่เอาคำนาม + 이에요 หรือ 예요 ก็พูดแนะนำตัวได้แล้ว!',
    lessonHTML: `
      <p>อยากบอกว่า "ฉันเป็น..." แค่พูดว่า <button class="speak-chip" onclick="speak('저는')">🔊 저는</button> (ฉัน) + อาชีพ/สัญชาติ + <strong class="kr">이에요 / 예요</strong></p>
      <div class="g-examples">
        <div class="g-ex"><button class="speak-btn" onclick="speak('저는 학생이에요.')">🔊</button> <span class="kr">저는 학생<strong>이에요</strong>.</span> <span class="th-read">(ชอ-นึน ฮัก-แซง-อี-เอ-โย)</span> = ฉันเป็นนักเรียน</div>
        <div class="g-ex"><button class="speak-btn" onclick="speak('저는 의사예요.')">🔊</button> <span class="kr">저는 의사<strong>예요</strong>.</span> <span class="th-read">(ชอ-นึน อึย-ซา-เย-โย)</span> = ฉันเป็นหมอ</div>
        <div class="g-ex"><button class="speak-btn" onclick="speak('저는 태국 사람이에요.')">🔊</button> <span class="kr">저는 태국 사람<strong>이에요</strong>.</span> <span class="th-read">(ชอ-นึน แท-กุก ซา-รัม-อี-เอ-โย)</span> = ฉันเป็นคนไทย</div>
      </div>
    `,
    checks: [
      {
        q: 'อยากบอกว่า "ฉันเป็นเชฟ (요리사)" — ดูตัวสุดท้าย 사 (ข้างล่างโล่ง) ต้องเติมอะไร?',
        opts: ['요리사이에요', '요리사예요'],
        ans: 1,
        okMsg: 'ถูกต้องเป๊ะ!! 사 ไม่มีตัวสะกด → 요리사예요 (โย-รี-ซา-เย-โย)!',
        hint: 'มองข้างล่างตัว 사 โล่งๆ ไม่มีตัวสะกด → ใช้ 예요 ครับ!',
        audio: '요리사예요'
      },
      {
        q: 'ถ้าคนถามว่า "어느 나라 사람이에요?" (เป็นคนประเทศไหน?) เราควรตอบว่าอะไร?',
        opts: ['저는 태국 사람이에요. (ฉันเป็นคนไทย)', '저는 학생이에요. (ฉันเป็นนักเรียน)'],
        ans: 0,
        okMsg: 'สุดยอด! 나라 = ประเทศ, 태국 = ประเทศไทย จำ 2 คำนี้ไว้ได้คะแนนฟรีเลย!',
        hint: 'คำว่า 나라 แปลว่า "ประเทศ" ครับ ลองเลือกข้อที่ตอบประเทศดูนะ!',
        audio: '저는 태국 사람이에요.'
      }
    ]
  },
  {
    id: 3,
    emoji: '❤️',
    title: 'ด่าน 3: ชอบ 👍 vs ไม่ชอบ 👎',
    subtitle: 'จำแค่เสียงไทย: "โช-อา" = ชอบอ่า! / "ชี-รอ" = ชิ! ไม่เอาหรอก!',
    lessonHTML: `
      <div class="g-compare">
        <div class="g-box g-teal">
          <div class="g-big">👍 ชอบ</div>
          <button class="speak-chip" onclick="speak('좋아해요')">🔊 좋아해요</button>
          <span class="th-read-block">(โช-อา-แฮ-โย = ชอบอ่า!)</span>
        </div>
        <div class="g-box g-coral">
          <div class="g-big">👎 ไม่ชอบ</div>
          <button class="speak-chip" onclick="speak('싫어해요')">🔊 싫어해요</button>
          <span class="th-read-block">(ชี-รอ-แฮ-โย = ชิ! ไม่เอา!)</span>
        </div>
      </div>
      <div class="g-examples">
        <div class="g-ex"><button class="speak-btn" onclick="speak('사과를 좋아해요.')">🔊</button> <span class="kr">사과<strong>를</strong> 좋아해요.</span> <span class="th-read">(ซา-กวา-รึล โช-อา-แฮ-โย)</span> = ชอบแอปเปิ้ล</div>
        <div class="g-ex"><button class="speak-btn" onclick="speak('라면을 싫어해요.')">🔊</button> <span class="kr">라면<strong>을</strong> 싫어해요.</span> <span class="th-read">(รา-มยอน-อึล ชี-รอ-แฮ-โย)</span> = ไม่ชอบรามยอน</div>
      </div>
    `,
    checks: [
      {
        q: 'ถ้าเห็นรูป "🏃 운동 👍" (ออกกำลังกาย + ยกนิ้วโป้ง) ต้องพูดว่าอะไร?',
        opts: ['운동을 좋아해요. (โช-อา = ชอบ)', '운동을 싫어해요. (ชี-รอ = ไม่ชอบ)'],
        ans: 0,
        okMsg: 'เป๊ะเลย!! ยกนิ้วโป้ง = ชอบ = 좋아해요 (โช-อา-แฮ-โย)!',
        hint: 'จำเสียงง่ายๆ: "โช-อา" (좋아해요) = ชอบอ่า! 👍',
        audio: '운동을 좋아해요.'
      },
      {
        q: 'คำว่า "아메리카노" (อเมริกาโน่) ตัวสุดท้าย 노 ไม่มีตัวสะกด ใช้ 을 หรือ 를?',
        opts: ['아메리카노을 좋아해요', '아메리카노를 좋아해요'],
        ans: 1,
        okMsg: 'เก่งขึ้นเรื่อยๆ เลย! 노 ข้างล่างโล่ง → ใช้ 를!',
        hint: 'ดูข้างล่างตัว 노 ไม่มีตัวสะกด → ใช้ 를 (ไม่มีวงกลม) ครับ!',
        audio: '아메리카노를 좋아해요.'
      }
    ]
  },
  {
    id: 4,
    emoji: '🍽️',
    title: 'ด่าน 4: สั่งอาหาร / ขอของ (주세요)',
    subtitle: 'อยากได้อะไร พูดชื่อของ + 주세요 (ชู-เซ-โย) = "ขอ...หน่อยครับ"',
    lessonHTML: `
      <p>เวลาไปร้านอาหารหรือคาเฟ่ เจอคำนี้ในข้อสอบบ่อยมาก:</p>
      <div class="g-examples">
        <div class="g-ex"><button class="speak-btn" onclick="speak('물 좀 주세요.')">🔊</button> <span class="kr">물 좀 <strong>주세요</strong>.</span> <span class="th-read">(มุล จม ชู-เซ-โย)</span> = ขอน้ำหน่อยครับ</div>
        <div class="g-ex"><button class="speak-btn" onclick="speak('아메리카노 주세요.')">🔊</button> <span class="kr">아메리카노 <strong>주세요</strong>.</span> <span class="th-read">(อา-เม-รี-คา-โน ชู-เซ-โย)</span> = ขออเมริกาโน่ครับ</div>
        <div class="g-ex"><button class="speak-btn" onclick="speak('빵하고 콜라 주세요.')">🔊</button> <span class="kr">빵<strong>하고</strong> 콜라 주세요.</span> <span class="th-read">(ปัง-ฮา-โก คล-ลา ชู-เซ-โย)</span> = ขอขนมปัง <strong>และ</strong> โคล่า</div>
      </div>
      <p class="muted">💡 จำเพิ่มอีก 1 คำ: <strong class="kr">하고</strong> (ฮา-โก) = <strong>"และ / กับ"</strong></p>
    `,
    checks: [
      {
        q: 'พนักงานถามว่า "뭘 드릴까요?" (รับอะไรดีคะ?) เราอยากสั่งบูลโกกิ (불고기) ต้องตอบว่าอะไร?',
        opts: ['불고기 주세요.', '불고기 있어요.'],
        ans: 0,
        okMsg: 'ใช่เลย!! สั่งอาหาร/ขอของ = พูดชื่ออาหาร + 주세요 (ชู-เซ-โย)!',
        hint: 'สั่งของต้องลงท้ายด้วย 주세요 (ขอ...หน่อย) ครับ!',
        audio: '불고기 주세요.'
      }
    ]
  },
  {
    id: 5,
    emoji: '🟢',
    title: 'ด่าน 5: เลขเกาหลี 1–5 (แก๊งนับของใกล้ตัว)',
    subtitle: 'จำแค่ 5 ตัวนี้ก่อน! เอาไว้ใช้นับชิ้น (개), นับคน (명), บอกชั่วโมง (시)',
    lessonHTML: `
      <p>กดฟังเสียงแล้วพูดตามเบาๆ แค่ 5 คำนี้ครับ (สังเกตตัวที่แปลงร่างสั้นลง):</p>
      <div class="g-num-row">
        <button class="g-num-btn" onclick="speak('한 개')"><strong>1</strong><span class="kr">하나 → 한</span><span class="th-read">(ฮา-นา → ฮัน)</span></button>
        <button class="g-num-btn" onclick="speak('두 개')"><strong>2</strong><span class="kr">둘 → 두</span><span class="th-read">(ทุล → ทู)</span></button>
        <button class="g-num-btn" onclick="speak('세 개')"><strong>3</strong><span class="kr">셋 → 세</span><span class="th-read">(เซ็ต → เซ)</span></button>
        <button class="g-num-btn" onclick="speak('네 개')"><strong>4</strong><span class="kr">넷 → 네</span><span class="th-read">(เน็ต → เน)</span></button>
        <button class="g-num-btn" onclick="speak('다섯 개')"><strong>5</strong><span class="kr">다섯</span><span class="th-read">(ทา-ซอต)</span></button>
      </div>
      <p class="muted" style="margin-top:8px">จำลักษณะนาม 3 ตัวหลัก: <strong class="kr">개</strong> (อัน/ชิ้น) • <strong class="kr">명</strong> (คน) • <strong class="kr">살</strong> (อายุ/ปี)</p>
    `,
    checks: [
      {
        q: '👓 👓 มีแว่นตา 2 อัน — ต้องพูดว่าอะไร? (จำ: 둘 แปลงร่างเป็น 두!)',
        opts: ['둘 개 있어요', '두 개 있어요'],
        ans: 1,
        okMsg: 'แม่นมาก!! เลข 1-4 หน้าลักษณะนามต้องตัดหางสั้นเป็น 한, 두, 세, 네 → 두 개 있어요!',
        hint: 'หน้าคำว่า 개 เลข 2 (둘) จะเขินจนตัดตัวสะกดทิ้งเป็น 두 ครับ!',
        audio: '두 개 있어요.'
      },
      {
        q: '⏰ ⏰ ⏰ มีนาฬิกา 3 เรือน — ข้อใดถูกต้อง?',
        opts: ['세 개 있어요', '네 개 있어요'],
        ans: 0,
        okMsg: 'ถูกต้องครับ! 3 = 세 (เซ), 4 = 네 (เน) — เริ่มคล่องแล้วเห็นไหม!',
        hint: '1=한, 2=두, 3=세, 4=네 ครับ ลองกด 3 ดูนะ!',
        audio: '세 개 있어요.'
      }
    ]
  },
  {
    id: 6,
    emoji: '🔴',
    title: 'ด่าน 6: เลขจีน 0–10 (แก๊งตัวเลขบนป้าย/เบอร์โทร/ชั้น)',
    subtitle: 'เลขจีนจำง่ายมาก เพราะเสียงคล้ายเลขจีนแต้จิ๋วเลย (อิล-อี-ซัม-ซา-โอ...)',
    lessonHTML: `
      <p>กดฟังทีละตัวได้เลยครับ ใช้กับ <strong>เบอร์โทร (번), ชั้นตึก (층), วันที่ (일), ราคา (원), นาที (분)</strong>:</p>
      <div class="g-num-row">
        <button class="g-num-btn" onclick="speak('공')"><strong>0</strong><span class="kr">공</span><span class="th-read">(คง)</span></button>
        <button class="g-num-btn" onclick="speak('일')"><strong>1</strong><span class="kr">일</span><span class="th-read">(อิล)</span></button>
        <button class="g-num-btn" onclick="speak('이')"><strong>2</strong><span class="kr">이</span><span class="th-read">(อี)</span></button>
        <button class="g-num-btn" onclick="speak('삼')"><strong>3</strong><span class="kr">삼</span><span class="th-read">(ซัม)</span></button>
        <button class="g-num-btn" onclick="speak('사')"><strong>4</strong><span class="kr">사</span><span class="th-read">(ซา)</span></button>
        <button class="g-num-btn" onclick="speak('오')"><strong>5</strong><span class="kr">오</span><span class="th-read">(โอ)</span></button>
        <button class="g-num-btn" onclick="speak('육')"><strong>6</strong><span class="kr">육</span><span class="th-read">(ยุก)</span></button>
        <button class="g-num-btn" onclick="speak('칠')"><strong>7</strong><span class="kr">칠</span><span class="th-read">(ชิล)</span></button>
        <button class="g-num-btn" onclick="speak('팔')"><strong>8</strong><span class="kr">팔</span><span class="th-read">(พัล)</span></button>
        <button class="g-num-btn" onclick="speak('구')"><strong>9</strong><span class="kr">구</span><span class="th-read">(คู)</span></button>
        <button class="g-num-btn" onclick="speak('십')"><strong>10</strong><span class="kr">십</span><span class="th-read">(ชิบ)</span></button>
      </div>
      <p class="muted" style="margin-top:8px">📞 ในเบอร์โทร: <strong>0 = 공 (คง)</strong> และ <strong>ขีด (-) = 에 (เอ)</strong> เช่น 010 = <button class="speak-chip" onclick="speak('공일공')">🔊 공일공</button></p>
    `,
    checks: [
      {
        q: 'ป้ายลิฟต์ "7 FLOOR" (ชั้น 7) — ใช้เลขจีน + 층 (ชึง) ข้อใดถูก?',
        opts: ['일곱 층이에요 (เลขเกาหลี)', '칠 층이에요 (เลขจีน)'],
        ans: 1,
        okMsg: 'เยี่ยมยอด!! ชั้นตึก (층) อยู่บนป้าย → ใช้แก๊งเลขจีน → 칠 층이에요!',
        hint: 'ชั้นลิฟต์ (층) เป็นตัวเลขบนป้าย ใช้แก๊งเลขจีน (7 = 칠) ครับ!',
        audio: '칠 층이에요.'
      },
      {
        q: 'รหัสผ่านประตู "1590" อ่านด้วยเลขจีนทีละตัวได้ว่าอะไร?',
        opts: ['일오구공 (1-5-9-0)', '이오팔공 (2-5-8-0)'],
        ans: 0,
        okMsg: 'ตรง Study Review Ex.10 เป๊ะ!! 1=일, 5=오, 9=구, 0=공!',
        hint: 'ไล่ทีละตัวครับ: 1(일) - 5(오) - 9(구) - 0(공)',
        audio: '일오구공'
      }
    ]
  },
  {
    id: 7,
    emoji: '💰',
    title: 'ด่าน 7: ราคาเงินวอน (원) & 2 เดือนตัวป่วน',
    subtitle: 'จำแค่ 3 คำ: 백(ร้อย), 천(พัน), 만(หมื่น) + เดือน 6/10 ที่ออกสอบทุกปี!',
    lessonHTML: `
      <div class="g-examples">
        <div class="g-ex"><button class="speak-btn" onclick="speak('삼천 원이에요.')">🔊</button> ₩3,000 = <span class="kr">삼천 원이에요.</span> <span class="th-read">(ซัม-ชอน วอน = 3 พัน วอน)</span></div>
        <div class="g-ex"><button class="speak-btn" onclick="speak('사천오백 원이에요.')">🔊</button> ₩4,500 = <span class="kr">사천오백 원이에요.</span> <span class="th-read">(ซา-ชอน โอ-แพ็ก วอน = 4 พัน 5 ร้อย)</span></div>
        <div class="g-ex"><button class="speak-btn" onclick="speak('만 오천 원이에요.')">🔊</button> ₩15,000 = <span class="kr">만 오천 원이에요.</span> <span class="th-read">(มัน โอ-ชอน วอน = หมื่น 5 พัน • ไม่ใส่ 일 หน้า 만!)</span></div>
      </div>
      <div class="kid-memory" style="margin-top:10px">
        📅 <strong>2 เดือนที่ต้องจำให้ขึ้นใจ:</strong><br/>
        • เดือน 6 (มิ.ย.) = <button class="speak-chip" onclick="speak('유월')">🔊 유월 (ยู-วอล)</button> (ห้ามเขียน 육월)<br/>
        • เดือน 10 (ต.ค.) = <button class="speak-chip" onclick="speak('시월')">🔊 시월 (ชี-วอล)</button> (ห้ามเขียน 십월)
      </div>
    `,
    checks: [
      {
        q: 'แอปเปิ้ลราคา ₩17,000 (10,000 + 7,000) เขียนอย่างไร?',
        opts: ['만 칠천 원 (หมื่น + เจ็ดพัน)', '일만 칠천 원 (หนึ่งหมื่น + เจ็ดพัน)'],
        ans: 0,
        okMsg: 'เก่งมาก!! กฎเหล็ก: ห้ามใส่ 일 หน้า 백/천/만 → 만 칠천 원!',
        hint: 'จำกฎเหล็กครับ: 10,000 ใช้แค่ 만 (ไม่ต้องใส่ 일 ข้างหน้า)',
        audio: '만 칠천 원'
      },
      {
        q: 'เดือน "มิถุนายน (เดือน 6)" ในภาษาเกาหลีคือคำไหน?',
        opts: ['육월', '유월'],
        ans: 1,
        okMsg: 'ไม่โดนหลอกแล้ว!! 6월 = 유월 (ยู-วอล) และ 10월 = 시월 (ชี-วอล)!',
        hint: 'เดือน 6 กับเดือน 10 เป็นตัวป่วนที่ตัดตัวสะกดทิ้ง → 유월 ครับ!',
        audio: '유월'
      }
    ]
  },
  {
    id: 8,
    emoji: '⏰',
    title: 'ด่าน 8: บอกเวลา (ผสม 2 แก๊ง!)',
    subtitle: 'จำง่ายๆ: ชั่วโมง (시) = เลขเกาหลี • นาที (분) = เลขจีน • 30 นาที = 반 (ครึ่ง)',
    lessonHTML: `
      <div class="g-examples">
        <div class="g-ex">☀️ เช้า (a.m.) = <button class="speak-chip" onclick="speak('오전')">🔊 오전 (โอ-จอน)</button> | 🌙 บ่าย (p.m.) = <button class="speak-chip" onclick="speak('오후')">🔊 오후 (โอ-ฮู)</button></div>
        <div class="g-ex"><button class="speak-btn" onclick="speak('오전 다섯 시 이십 분이에요.')">🔊</button> 05:20 เช้า = <span class="kr">오전 <strong>다섯 시</strong> <strong>이십 분</strong>이에요.</span></div>
        <div class="g-ex"><button class="speak-btn" onclick="speak('오전 여덟 시 반이에요.')">🔊</button> 08:30 เช้า = <span class="kr">오전 <strong>여덟 시 반</strong>이에요.</span> <span class="th-read">(30 นาที ใช้ 반 = ครึ่ง ง่ายกว่าเยอะ!)</span></div>
      </div>
    `,
    checks: [
      {
        q: 'นาฬิกาขึ้น [오후 2:30] (บ่าย 2 โมงครึ่ง) — เลือกคำตอบที่ถูก!',
        opts: ['오후 이 시 반이에요 (ใช้เลขจีนกับชั่วโมง)', '오후 두 시 반이에요 (ใช้เลขเกาหลีกับชั่วโมง)'],
        ans: 1,
        okMsg: 'ถูกต้อง!! ชั่วโมงต้องใช้เลขเกาหลี (두 시) เท่านั้น! คุณมาไกลกว่า 80% แล้ว!',
        hint: 'จำ: ชั่วโมง (시) = เลขเกาหลี (1=한, 2=두, 3=세, 4=네) ครับ!',
        audio: '오후 두 시 반이에요.'
      }
    ]
  },
  {
    id: 9,
    emoji: '📍',
    title: 'ด่าน 9: อยู่ที่ไหน? & 6 ตำแหน่งออกสอบบ่อย',
    subtitle: 'สูตร: [สิ่งของ] + [ตำแหน่ง] + 에 있어요 (เรียงสลับกับภาษาไทย!)',
    lessonHTML: `
      <p>คลิกฟังเสียง 6 ตำแหน่งที่ออก Part 3 Writing บ่อยที่สุด:</p>
      <div class="g-num-row">
        <button class="g-num-btn" onclick="speak('위')"><strong>บน ⬆️</strong><span class="kr">위</span><span class="th-read">(วี)</span></button>
        <button class="g-num-btn" onclick="speak('아래')"><strong>ล่าง ⬇️</strong><span class="kr">아래 / 밑</span><span class="th-read">(อา-แร / มิด)</span></button>
        <button class="g-num-btn" onclick="speak('앞')"><strong>หน้า 👉</strong><span class="kr">앞</span><span class="th-read">(อับ)</span></button>
        <button class="g-num-btn" onclick="speak('뒤')"><strong>หลัง 👈</strong><span class="kr">뒤</span><span class="th-read">(ทวี)</span></button>
        <button class="g-num-btn" onclick="speak('옆')"><strong>ข้างๆ ↔️</strong><span class="kr">옆</span><span class="th-read">(ยอบ)</span></button>
        <button class="g-num-btn" onclick="speak('안')"><strong>ใน/นอก 📦</strong><span class="kr">안 / 밖</span><span class="th-read">(อัน / พัก)</span></button>
      </div>
      <div class="g-examples" style="margin-top:10px">
        <div class="g-ex"><button class="speak-btn" onclick="speak('가방이 책상 위에 있어요.')">🔊</button> <span class="kr">가방이 <strong>책상 위에</strong> 있어요.</span> = กระเป๋าอยู่ <strong>บนโต๊ะ</strong></div>
      </div>
    `,
    checks: [
      {
        q: 'ถ้ากระเป๋าอยู่ "ใต้โต๊ะ" ต้องใช้คำไหน?',
        opts: ['위 (บน)', '아래 (ล่าง/ใต้)', '밖 (ข้างนอก)'],
        ans: 1,
        okMsg: 'เป๊ะมาก!! 아래 (อา-แร) หรือ 밑 (มิด) = ใต้/ข้างล่าง!',
        hint: 'บน=위, ล่าง/ใต้=아래 ครับ!',
        audio: '아래'
      }
    ]
  },
  {
    id: 10,
    emoji: '🎉',
    title: 'ด่าน 10 (ด่านสุดท้าย!): ครอบครัว & คำลา',
    subtitle: 'อีกนิดเดียวจบครบ 10 ด่านแล้ว — คุณทำได้แน่นอน!',
    lessonHTML: `
      <div class="g-compare">
        <div class="g-box g-teal">
          <strong>👋 คำลา (จำจากตัวอักษรไทย!)</strong>
          <div style="margin-top:6px"><button class="speak-chip" onclick="speak('안녕히 가세요.')">🔊 안녕히 <strong>가</strong>세요</button><br/><small><strong>กา = ก้าวขาไป!</strong> (พูดกับคนที่จะไป)</small></div>
          <div style="margin-top:6px"><button class="speak-chip" onclick="speak('안녕히 계세요.')">🔊 안녕히 <strong>계</strong>세요</button><br/><small><strong>เค = แค่ยืนอยู่!</strong> (พูดกับคนที่อยู่ต่อ)</small></div>
        </div>
        <div class="g-box g-coral">
          <strong>👨‍👩‍👧‍👦 พี่ชาย / พี่สาว (ดูเพศเรา!)</strong>
          <div style="margin-top:6px">👩 ผู้หญิงเรียก: <button class="speak-chip" onclick="speak('오빠')">🔊 오빠 (พี่ชาย)</button> <button class="speak-chip" onclick="speak('언니')">🔊 언니 (พี่สาว)</button></div>
          <div style="margin-top:6px">👨 ผู้ชายเรียก: <button class="speak-chip" onclick="speak('형')">🔊 형 (พี่ชาย)</button> <button class="speak-chip" onclick="speak('누나')">🔊 누나 (พี่สาว)</button></div>
        </div>
      </div>
    `,
    checks: [
      {
        q: 'เรากำลังจะเดินกลับบ้าน พูดลาเพื่อนที่ยังอยู่ในบ้านว่าอะไร?',
        opts: ['안녕히 가세요 (กา = ก้าวไป)', '안녕히 계세요 (เค = แค่ยืนอยู่)'],
        ans: 1,
        okMsg: '🎊 ยินดีด้วย!! คุณเรียนจบครบทั้ง 10 ด่านแล้ว! ตอนนี้คุณมีอาวุธครบพอที่จะสอบผ่าน Final แน่นอนครับ!',
        hint: 'เพื่อนยัง "อยู่ต่อ" ในบ้าน → ใช้ เค (계세요 = แค่ยืนอยู่ตรงนี้) ครับ!',
        audio: '안녕히 계세요.'
      }
    ]
  }
];

let currentGuidedIdx = 0;

function extractKoreanPhrase(str) {
  if (!str) return '';
  const m = str.match(/[가-힣0-9]+(?:\s+[가-힣0-9]+)*/g);
  if (!m) return '';
  const joined = m.join(' ').trim();
  return /[가-힣]/.test(joined) ? joined : '';
}

function renderGuidedStage() {
  const wrap = document.getElementById('guided-stage-container');
  if (!wrap) return;
  const stage = GUIDED_STAGES[currentGuidedIdx];
  const doneMap = state.guidedDone || {};
  const doneCount = Object.values(doneMap).filter(Boolean).length;
  const pct = Math.round((doneCount / GUIDED_STAGES.length) * 100);

  // Stage dots
  const dotsHTML = GUIDED_STAGES.map((s, idx) => {
    const isDone = !!doneMap[s.id];
    const isCur = idx === currentGuidedIdx;
    return `<button class="stage-dot ${isCur ? 'current' : ''} ${isDone ? 'done' : ''}" onclick="goGuidedStage(${idx})" title="${s.title.replace(/"/g, '&quot;')}">${isDone ? '✓' : s.id}</button>`;
  }).join('');

  wrap.innerHTML = `
    <div class="guided-top-bar">
      <div class="guided-progress-text" style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap">
        <span><strong>🌱 โหมดจับมือเรียนทีละก้าว</strong> — ด่านที่ ${stage.id} จาก ${GUIDED_STAGES.length} (ผ่านแล้ว ${doneCount}/${GUIDED_STAGES.length} ด่าน • ${pct}%)</span>
        <button class="btn-tiny btn-outline" onclick="resetGuided()">🔄 รีเซ็ต 10 ด่าน</button>
      </div>
      <div class="guided-bar-track"><div class="guided-bar-fill" style="width:${Math.max(10, pct)}%"></div></div>
      <div class="stage-dots">${dotsHTML}</div>
    </div>

    <div class="guided-card">
      <div class="guided-head">
        <span class="guided-emoji">${stage.emoji}</span>
        <div>
          <h2>${stage.title}</h2>
          <p class="muted">${stage.subtitle}</p>
        </div>
      </div>

      <div class="guided-lesson">${stage.lessonHTML}</div>

      <div class="guided-checks">
        <h3>✨ ลองเช็กความเข้าใจสั้นๆ (กด 🔊 ฟังเสียงคำถามและตัวเลือกได้ทุกข้อ!)</h3>
        ${stage.checks.map((ck, cIdx) => {
          const qKr = extractKoreanPhrase(ck.q);
          return `
          <div class="g-check-box" id="gcheck-${stage.id}-${cIdx}">
            <div class="g-check-q-row">
              <div class="g-check-q">${cIdx + 1}. ${ck.q}</div>
              ${qKr ? `<button class="speak-btn" onclick="speak('${qKr.replace(/'/g, "\\'")}')">🔊 ฟังคำในโจทย์</button>` : ''}
            </div>
            ${qKr ? buildWordBreakdownHTML(qKr) : ''}
            <div class="g-check-opts">
              ${ck.opts.map((opt, oIdx) => {
                const optKr = extractKoreanPhrase(opt);
                return `
                <div class="g-opt-wrap">
                  <button class="choice-btn kr" onclick="checkGuidedAnswer(${stage.id}, ${cIdx}, ${oIdx})">${opt}${optKr ? readTag(optKr, true) : ''}</button>
                  ${optKr ? `<button class="speak-btn g-opt-speak" title="ฟังเสียงตัวเลือกนี้" onclick="event.stopPropagation(); speak('${optKr.replace(/'/g, "\\'")}')">🔊</button>` : ''}
                </div>`;
              }).join('')}
            </div>
            <div class="g-check-fb" id="gcheck-fb-${stage.id}-${cIdx}"></div>
          </div>
        `;
        }).join('')}
      </div>

      <div class="guided-nav-footer">
        <button class="btn btn-outline" ${currentGuidedIdx === 0 ? 'disabled' : ''} onclick="goGuidedStage(${currentGuidedIdx - 1})">← ด่านก่อนหน้า</button>
        ${currentGuidedIdx < GUIDED_STAGES.length - 1
          ? `<button class="btn btn-primary" onclick="completeAndNextGuided(${stage.id})">เข้าใจแล้ว! ไปด่านที่ ${stage.id + 1} →</button>`
          : `<button class="btn btn-coral" onclick="completeAndNextGuided(${stage.id}); switchTab('exam')">🎉 จบ 10 ด่านแล้ว! ไปลองสอบจำลอง →</button>`
        }
      </div>
    </div>
  `;

  // Inject word-by-word breakdown under every example line and enhance all chips in this guided stage
  wrap.querySelectorAll('.g-ex').forEach(el => {
    const krParts = (el.textContent || '').match(/[가-힣0-9]+(?:\s+[가-힣0-9]+)*/g);
    if (!krParts) return;
    const html = buildWordBreakdownHTML(krParts.join(' '));
    if (html) {
      const div = document.createElement('div');
      div.innerHTML = html;
      el.appendChild(div.firstElementChild);
    }
  });
  if (typeof enhanceAllKoreanContent === 'function') {
    enhanceAllKoreanContent(wrap);
  }
}

function goGuidedStage(idx) {
  currentGuidedIdx = Math.max(0, Math.min(GUIDED_STAGES.length - 1, idx));
  renderGuidedStage();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function checkGuidedAnswer(stageId, checkIdx, chosenIdx) {
  const stage = GUIDED_STAGES.find(s => s.id === stageId);
  const ck = stage.checks[checkIdx];
  const fb = document.getElementById(`gcheck-fb-${stageId}-${checkIdx}`);
  const box = document.getElementById(`gcheck-${stageId}-${checkIdx}`);
  const btns = box.querySelectorAll('.choice-btn');

  if (chosenIdx === ck.ans) {
    btns.forEach((b, i) => {
      b.classList.remove('wrong');
      if (i === ck.ans) b.classList.add('correct');
    });
    fb.className = 'g-check-fb ok';
    fb.innerHTML = `✅ ${ck.okMsg} <button class="speak-chip" onclick="speak('${ck.audio}')">🔊 ฟังอีกครั้ง</button>`;
    speak(ck.audio);
    if (!state.guidedDone) state.guidedDone = {};
    state.guidedDone[stageId] = true;
    saveState();
  } else {
    btns[chosenIdx].classList.add('wrong');
    fb.className = 'g-check-fb hint';
    fb.textContent = `💛 ไม่เป็นไรเลยครับ! ${ck.hint}`;
  }
}

function completeAndNextGuided(stageId) {
  if (!state.guidedDone) state.guidedDone = {};
  state.guidedDone[stageId] = true;
  saveState();
  if (currentGuidedIdx < GUIDED_STAGES.length - 1) {
    currentGuidedIdx++;
    renderGuidedStage();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function resetGuided() {
  state.guidedDone = {};
  currentGuidedIdx = 0;
  saveState();
  renderGuidedStage();
}

// Initialize guided stage on load
renderGuidedStage();
