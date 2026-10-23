/**
 * TEST SUITE: Dịch Màn Hình iOS (dich-ios)
 * Kiểm thử toàn diện chức năng & bảo mật
 */

const fs = require('fs');
const path = require('path');

const results = [];
function recordResult(name, passed, details) {
  results.push({ name, passed, details });
  const mark = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${mark} | ${name}`);
  if (details) console.log(`   └─ ${details}`);
}

async function runTests() {
  console.log('====================================================');
  console.log('🧪 BẮT ĐẦU KIỂM THỬ DỰ ÁN: dich-ios');
  console.log('====================================================\n');

  const dir = __dirname;
  const indexPath = path.join(dir, 'index.html');

  // TEST 1: Cấu trúc file
  try {
    const hasIndex = fs.existsSync(indexPath);
    recordResult('1. File index.html tồn tại', hasIndex, `index.html: ${hasIndex}`);
  } catch (e) {
    recordResult('1. File index.html tồn tại', false, e.message);
  }

  const html = fs.readFileSync(indexPath, 'utf8');

  // TEST 2: Cấu hình AI Gateway mới
  try {
    const usesAiNoFree = html.includes('ai-no-free.ngxuanhai123.workers.dev');
    const usesCorrectModel = html.includes('tranhieu13102003/gpt-6-luna') || html.includes('gpt-6-luna');
    const usesAuthKey = html.includes('Ai@123');
    const passed = usesAiNoFree && usesCorrectModel && usesAuthKey;
    recordResult('2. Cấu hình AI Gateway mới (ai-no-free, gpt-6-luna, Ai@123)', passed, `ai-no-free: ${usesAiNoFree}, model: ${usesCorrectModel}, authKey: ${usesAuthKey}`);
  } catch (e) {
    recordResult('2. Cấu hình AI Gateway mới', false, e.message);
  }

  // TEST 3: Kiểm tra xử lý query parameter `?data=`
  try {
    const hasUrlParamsCheck = html.includes('urlParams.get(\'data\')') || html.includes('urlParams.get("data")');
    recordResult('3. Nhận dữ liệu từ Shortcut query parameter (?data=)', hasUrlParamsCheck, 'Đúng định dạng shortcut iOS');
  } catch (e) {
    recordResult('3. Nhận dữ liệu từ Shortcut query parameter', false, e.message);
  }

  // TEST 4: Gọi thử AI Gateway thực tế cho dịch màn hình
  try {
    const t0 = Date.now();
    const res = await fetch('https://ai-no-free.ngxuanhai123.workers.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer Ai@123'
      },
      body: JSON.stringify({
        model: 'tranhieu13102003/gpt-6-luna',
        messages: [
          { role: 'system', content: 'Bạn là chuyên gia dịch thuật màn hình. Hãy dịch văn bản sau sang tiếng Việt ngắn gọn, súc tích và tự nhiên. Chỉ trả về bản dịch tiếng Việt.' },
          { role: 'user', content: 'Swipe up to open app switcher.' }
        ],
        max_tokens: 50
      })
    });
    const lat = Date.now() - t0;
    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || '';
    const passed = res.status === 200 && text.length > 0;
    recordResult('4. Gọi thử AI Gateway thực tế dịch màn hình iOS', passed, `Status: ${res.status}, Latency: ${lat}ms, Trả lời: "${text.trim()}"`);
  } catch (e) {
    recordResult('4. Gọi thử AI Gateway thực tế dịch màn hình iOS', false, e.message);
  }

  const passedCount = results.filter(r => r.passed).length;
  console.log('\n====================================================');
  console.log(`📊 KẾT QUẢ KIỂM THỬ: ${passedCount}/${results.length} bài test vượt qua`);
  console.log('====================================================\n');
}

runTests();
