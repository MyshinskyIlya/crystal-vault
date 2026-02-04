use aes_gcm::{aead::Aead, Aes256Gcm, Key, KeyInit};
use rand::RngCore;
use serde::Serialize;

#[derive(Serialize)]
struct EncryptedResult {
    data: String,
    duration_ms: f64,
}

#[tauri::command]
fn encrypt_vault(password: String, secret_key: String) -> Result<EncryptedResult, String> {
    let start = std::time::Instant::now();

    // 1. Подготавливаем ключ (должен быть ровно 32 байта для AES-256)
    let mut key_bytes = [0u8; 32];
    let secret_bytes = secret_key.as_bytes();
    let len = secret_bytes.len().min(32);
    key_bytes[..len].copy_from_slice(&secret_bytes[..len]);

    let key = Key::<Aes256Gcm>::from_slice(&key_bytes);
    let cipher = Aes256Gcm::new(key);

    // 2. Генерируем случайный "nonce" (одноразовый код для безопасности)
    let mut nonce_bytes = [0u8; 12];
    rand::thread_rng().fill_bytes(&mut nonce_bytes);
    let nonce = aes_gcm::Nonce::from_slice(&nonce_bytes);

    // 3. Шифруем данные
    let ciphertext = cipher
        .encrypt(nonce, password.as_bytes())
        .map_err(|e| e.to_string())?;

    // 4. Склеиваем nonce и результат, чтобы потом можно было расшифровать
    let mut final_payload = nonce_bytes.to_vec();
    final_payload.extend(ciphertext);

    Ok(EncryptedResult {
        data: hex::encode(final_payload),
        duration_ms: start.elapsed().as_secs_f64() * 1000.0,
    })
}

#[tauri::command]
fn decrypt_vault(encrypted_hex: String, secret_key: String) -> Result<EncryptedResult, String> {
    let start = std::time::Instant::now();

    // 1. Декодируем Hex-строку обратно в байты
    let encrypted_data = hex::decode(encrypted_hex).map_err(|_| "Неверный формат шифра")?;

    if encrypted_data.len() < 12 {
        return Err("Данные слишком короткие (отсутствует nonce)".into());
    }

    // 2. Разделяем: первые 12 байт — это nonce, остальное — само сообщение
    let (nonce_bytes, ciphertext) = encrypted_data.split_at(12);
    let nonce = aes_gcm::Nonce::from_slice(nonce_bytes);

    // 3. Подготавливаем ключ (точно так же, как при шифровании)
    let mut key_bytes = [0u8; 32];
    let secret_bytes = secret_key.as_bytes();
    let len = secret_bytes.len().min(32);
    key_bytes[..len].copy_from_slice(&secret_bytes[..len]);

    let key = Key::<Aes256Gcm>::from_slice(&key_bytes);
    let cipher = Aes256Gcm::new(key);

    // 4. Расшифровываем
    let decrypted_bytes = cipher
        .decrypt(nonce, ciphertext)
        .map_err(|_| "Ошибка расшифровки: неверный ключ или данные повреждены")?;

    let decrypted_text =
        String::from_utf8(decrypted_bytes).map_err(|_| "Ошибка: данные не являются текстом")?;

    Ok(EncryptedResult {
        data: decrypted_text,
        duration_ms: start.elapsed().as_secs_f64() * 1000.0,
    })
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![encrypt_vault, decrypt_vault])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
