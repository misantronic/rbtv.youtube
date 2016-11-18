const numberFormatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0
});

module.exports = {
    format (number) {
        return numberFormatter.format(number);
    }
};
