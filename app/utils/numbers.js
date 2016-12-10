const numberFormatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0
});

export default {
    format(number) {
        return numberFormatter.format(number);
    },

    humanizeDuration(duration) {
        if (!duration) {
            return '';
        }

        const hours = ('0' + duration.hours()).slice(-2);
        const mins = ('0' + duration.minutes()).slice(-2);
        const secs = ('0' + duration.seconds()).slice(-2);

        // Add minutes + seconds
        const arr = [
            mins,
            secs
        ];

        // Add hours
        if (hours !== '00') arr.unshift(hours);

        return arr.join(':');
    }
};
