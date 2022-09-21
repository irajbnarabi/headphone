package ir.headphone.rest.init;

import org.apache.commons.lang3.StringUtils;

public final class Utils {
    private Utils() {
    }

    public static String convertToPersianNumber(String str) {
        char[] persianDigits = {'\u06f0', '\u06f1', '\u06f2', '\u06f3', '\u06f4', '\u06f5', '\u06f6', '\u06f7', '\u06f8', '\u06f9'};
        StringBuilder builder = new StringBuilder();
        for (int i = 0; i < str.length(); i++) {
            char c = str.charAt(i);
            if (Character.isDigit(c) && ((int) c) < 58 && ((int) c) > 47) {
                builder.append(persianDigits[(int) c - 48]);
            } else {
                builder.append(c);
            }
        }
        return builder.toString();
    }

    public static String normalizePersianString(String persian) {
        persian = persian.replaceAll("\u064a", "\u06cc");   // Replace Persian letter "Yeh" with Arabic letter "Yeh"
        persian = persian.replaceAll("\u0643", "\u06a9");   // Replace Persian letter "Kaf" with Arabic letter "Kaf"
        persian = persian.replaceAll("\ufed9", "\u06a9");   // Replace Persian letter "Kaf" with Arabic letter "Kaf"
        persian = persian.replaceAll("\u200D", "");         // Remove ZERO WIDTH NON-JOINER
        persian = persian.replaceAll("\u0640", "");         // Remove ZERO WIDTH NON-JOINER
        persian = persian.replaceAll("\u064b", "");         // Remove Arabic "Fathatan"
        persian = persian.replaceAll("\u064c", "");         // Remove Arabic "Dammatan"
        persian = persian.replaceAll("\u064d", "");         // Remove Arabic "Kasratan"
        persian = persian.replaceAll("\u064e", "");         // Remove Arabic "Fatha"
        persian = persian.replaceAll("\u064f", "");         // Remove Arabic "Damma"
        persian = persian.replaceAll("\u0650", "");         // Remove Arabic "Kasra"
        persian = persian.replaceAll("\u0651", "");         // Remove Arabic "Shadda"
        persian = persian.replaceAll("\u0652", "");         // Remove Arabic "Sukun"
        persian = persian.replaceAll("\u0653", "");         // Remove Arabic "Maddah Above"
        persian = persian.replaceAll("\u0654", "");         // Remove Arabic "Hamza Above"
        persian = persian.replaceAll("\u0655", "");         // Remove Arabic "Hamza Below"
        persian = persian.replaceAll("\u200c", "");         // Remove ZERO WIDTH NON-JOINER
        return persian;
    }

    public static String convertToLatinNumber(String str) {
        char[] arabicDigits = {'\u0660', '\u0661', '\u0662', '\u0663', '\u0664', '\u0665', '\u0666', '\u0667', '\u0668', '\u0669'}; //{'٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'};
        char[] persiaDigits = {'\u06f0', '\u06f1', '\u06f2', '\u06f3', '\u06f4', '\u06f5', '\u06f6', '\u06f7', '\u06f8', '\u06f9'}; //{'۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'};
        for (int i = 0; i < arabicDigits.length; i++) {
            str = str.replace(arabicDigits[i], (char) (i + 48));
            str = str.replace(persiaDigits[i], (char) (i + 48));
        }
        return str;
    }

    public static String convertMinutesToDuration(Integer minutes) {
        if (minutes < 60) {
            return String.valueOf(minutes) + "'";
        }
        return minutes / 60 + ":" + StringUtils.leftPad(String.valueOf(minutes % 60), 2, "0") + "'";
    }


}
