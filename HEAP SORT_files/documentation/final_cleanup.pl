use strict;
use warnings;
use utf8;

my $file = 'TESI.tex';
open my $in, '<:utf8', $file or die "Cannot open $file: $!";
my @lines = <$in>;
close $in;

my %replacements = (
    'priorit è' => 'priorità',
    'societ è' => 'società',
    'capacit è' => 'capacità',
    'attivit è' => 'attività',
    'possibilit è' => 'possibilità',
    'universit è' => 'università',
    'longevit è' => 'longevità',
    'reattivit è' => 'reattività',
    'creativit è' => 'creatività',
    'usabilit è' => 'usabilità',
    'manutenibilit è' => 'manutenibilità',
    'adattabilit è' => 'adattabilità',
    'qualit è' => 'qualità',
    'quantit è' => 'quantità',
    'necessit è' => 'necessità',
    'identit è' => 'identità',
    'solidit è' => 'solidità',
    'modalit è' => 'modalità',
    'visibilit è' => 'visibilità',
    'realit è' => 'realtà',
    'propriet è' => 'proprietà',
    'stabilit è' => 'stabilità',
    'responsabilit è' => 'responsabilità',
    'profondit è' => 'profondità',
    'd è' => 'dà',
    'it  ' => 'ità ',
    " e' " => ' è ',
    " gia' " => ' già ',
    " piu' " => ' più ',
    " cosi' " => ' così ',
    'perche ' => 'perché ',
    'affinche ' => 'affinché ',
    'Universalità ' => 'Universalità',
    'Longevità ' => 'Longevità',
    'aggiornare logico' => 'aggiornare logicamente',
    'Cos\' il' => 'Cos\'è il',
    'se lo ,' => 'se lo è,',
);

for my $line (@lines) {
    # Replace the stems with accents and spaces first
    while (my ($key, $val) = each %replacements) {
        $line =~ s/\Q$key\E/$val/g;
    }
    
    # Generic fixes for stems ending in it and space/egrave
    $line =~ s/\b(\w+it) [è ]\b/$1à/g unless $line =~ /lstlisting/ or $line =~ /texttt/;
    
    # Fix the space after accent problem
    $line =~ s/([àèéìòù])\s+([,.;:)\]\}])/$1$2/g;
}

open my $out, '>:utf8', $file or die "Cannot write $file: $!";
print $out @lines;
close $out;
print "Final cleanup complete.\n";
