# EXIF GPS Steganography

Quick project I decided to do, the goal is to hide a message within an image using the EXIF GPS data.

## How does it work?

Using EXIF, we can attach to an image its GPS location. The latitude and longitude are stored in DMS (Degrees Minutes Seconds) with their respective referential.

The referential is indicated by an ASCII character, 'N' for North, 'S' for South, 'E' for East, or 'W' for West. The actual coordinates are stored using 6 rational numbers, or 12 integers.

Example:
- S; 32/1; 11/1; 32/3,
- E; 31/1; 40/1; 11/7;

This tool allows the user to store a short message, using the rational numbers that determine the seconds of the coordinates.

The message is converted to decimal after being capitalized so that the decimal value of each character has a length of 2. It is then separated into 4 integers and these are inserted into the seconds' fields.

The tool allows the user to encode or decode a message. This is not an encryption method per se, but rather a fun way to hide a message in plain sight.

## Dependencies

- [Piexifjs 1.0.4](https://github.com/hMatoba/piexifjs)
