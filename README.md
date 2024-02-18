# central_pattana_test

Run docker-compose up.

Specify environment variables according to .env.example.

The system will send data through the Kafka topic "email-notification". It will receive uploaded files at the "file_upload_service" API endpoint via POST http://localhost:5000/file/upload and retrieve files via GET http://localhost:5000/file/:file_name.

Upon uploading a file, the system will send the filepath and the email for notification through the Kafka topic "email-notification".

When the seed_email_service receives data through the Kafka topic "email-notification", it will seed emails based on the received information.

Improvements for further development:

upload_file_service:

Implement a login system to authenticate users before allowing uploads, restricting uploads to authorized users only.
Add middleware to filter out potentially harmful files.
Integrate a database to store the list of uploaded files.
Create an API to receive file names and send them to the Kafka topic "email-notification" again.
seed_email_service:

Implement a login system to authenticate users before allowing them to seed emails, restricting seeding to authorized users only.
Integrate a database to log email sending activities.
Create an API to resend emails based on the log.