use strict;
use warnings;
use utf8;
binmode(STDOUT, ":utf8");

my $file = 'TESI.tex';
open my $in, '<:utf8', $file or die "Cannot open $file: $!";

my %stems = (
    'societ' => 'à',
    'capacit' => 'à',
    'priorit' => 'à',
    'attivit' => 'à',
    'accessibilit' => 'à',
    'possibilit' => 'à',
    'universit' => 'à',
    'longevit' => 'à',
    'finalit' => 'à',
    'facilt' => 'à',
    'usabilit' => 'à',
    'manutenibilit' => 'à',
    'adattabilit' => 'à',
    'reattivit' => 'à',
    'creattivit' => 'à',
    'affidabilit' => 'à',
    'qualit' => 'à',
    'quantit' => 'à',
    'necessit' => 'à',
    'identit' => 'à',
    'solidit' => 'à',
    'modalit' => 'à',
    'visibilit' => 'à',
    'realit' => 'à',
    'propriet' => 'à',
    'stabilit' => 'à',
    'responsabilit' => 'à',
    'profondit' => 'à',
);

while (my $line = <$in>) {
    # Check for "stem è" or "stem "
    foreach my $stem (keys %stems) {
        if ($line =~ /\b$stem [è ]/) {
            print "$.: MISSPELLED STEM: $line";
        }
    }
    
    # Check for common missing accents
    if ($line =~ /\b(perche|affinche|gia|piu|cosi)\b/) {
        print "$.: MISSING ACCENT: $line";
    }
    
    # Check for apostrophe instead of accent
    if ($line =~ /\b[a-z]+' /) {
        print "$.: APOSTROPHE: $line";
    }
}
close $in;
