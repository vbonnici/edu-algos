use strict;
use warnings;
binmode(STDOUT, ":utf8");

my $file = 'TESI.tex';
open my $in, '<:encoding(UTF-8)', $file or die "Cannot open $file: $!";

# Common Italian words that MUST have an accent
my %fixed_accents = (
    'perche' => 'perché',
    'affinche' => 'affinché',
    'affinche' => 'affinché',
    'gia' => 'già',
    'piu' => 'più',
    'cosi' => 'così',
    'pero' => 'però',
    'avro' => 'avrò',
    'saro' => 'sarò',
    'andro' => 'andrò',
    'lunedi' => 'lunedì',
    'martedi' => 'martedì',
    'mercoledi' => 'mercoledì',
    'giovedi' => 'giovedì',
    'venerdi' => 'venerdì',
    'cio' => 'ciò',
    'da' => 'dà', # only as a verb, risky to automate globally but I'll check context
    'e' => 'è',   # only as a verb
);

# Common patterns like "it è" or "it  " which are definitely broken
my @broken_patterns = (
    qr/it è /i,
    qr/it  /i,
    qr/it \b/,
    qr/e\'/,
    qr/a\'/,
);

while (my $line = <$in>) {
    chomp $line;
    # Check for words ending in 'it' that should probably be 'ità'
    if ($line =~ /\b(\w*it)\s+[è ]/ || $line =~ /\b(\w*it)\b/ ) {
        my $word = $1 || "";
        if ($word =~ /^[a-z]+it$/ && $word !~ /^(hit|bit|fit|it)$/i) {
             print "$.: POTENTIAL ITA ERROR: $line\n";
        }
    }
    
    # Check for common missing accents
    foreach my $err (keys %fixed_accents) {
        if ($line =~ /\b$err\b/) {
             # Special check for 'e' vs 'è' is too hard here, skip 'e' and 'da'
             next if $err eq 'e' or $err eq 'da';
             print "$.: MISSING ACCENT ($err): $line\n";
        }
    }

    # Check for apostrophe instead of accent
    if ($line =~ /\b[a-z]+[']\b/i) {
        print "$.: APOSTROPHE ERROR: $line\n";
    }

    # Check for broken "è" (with spaces around it unnecessarily)
    if ($line =~ / \s+è /) {
        print "$.: EXTRA SPACES AROUND È: $line\n";
    }
}
close $in;
