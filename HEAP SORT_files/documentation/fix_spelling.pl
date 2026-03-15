use strict;
use warnings;
use utf8;

my $file = 'TESI.tex';

open my $in, '<:utf8', $file or die "Cannot open $file: $!";
my @lines = <$in>;
close $in;

my %replacements = (
    'capacit ' => 'capacità ',
    'realt ' => 'realtà ',
    'velocit ' => 'velocità ',
    'difficolt ' => 'difficoltà ',
    'complessit ' => 'complessità ',
    'propriet ' => 'proprietà ',
    'stabilit ' => 'stabilità ',
    'modalit ' => 'modalità ',
    'attivit ' => 'attività ',
    'visibilit ' => 'visibilità ',
    'responsabilit ' => 'responsabilità ',
    'usabilit ' => 'usabilità ',
    'manutenibilit ' => 'manutenibilità ',
    'universalit ' => 'universalità ',
    'adattabilit ' => 'adattabilità ',
    'reattivit ' => 'reattività ',
    'creativit ' => 'creatività ',
    'professionalit ' => 'professionalità ',
    'disponibilit ' => 'disponibilità ',
    'affidabilit ' => 'affidabilità ',
    'potenzialit ' => 'potenzialità ',
    'scalabilit ' => 'scalabilità ',
    'longevit ' => 'longevità ',
    'integrit ' => 'integrità ',
    'vitalit ' => 'vitalità ',
    'quantit ' => 'quantità ',
    'necessit ' => 'necessità ',
    'cos ' => 'così ',
    'bens ' => 'bensì ',
    'pu ' => 'può ',
    'cio ' => 'cioè ',
    'perch ' => 'perché ',
    'L\'informatica ,' => 'L\'informatica è,',
    'natura, una disciplina dinamica;  giusto' => 'natura, una disciplina dinamica; è giusto'
);

for my $line (@lines) {
    # Replace the defined words (including cases where they are followed by punctuation)
    foreach my $bad (keys %replacements) {
        my $good = $replacements{$bad};
        
        # If the bad word ends in a space, we match it followed by space or punctuation
        if ($bad =~ / $/ ) {
            my $word = substr($bad, 0, -1);
            my $good_word = substr($good, 0, -1);
            $line =~ s/\b$word (\s|[.,;:)])/$good_word$1/g;
        } else {
            $line =~ s/\Q$bad\E/$good/g;
        }
    }
    
    # Fix double spaces that should be ' è '
    $line =~ s/([a-zA-Zàèìòù'"])\s\s([a-zA-Z])/$1 è $2/g;
    
    # Fix single cases that are very obvious from the previous grep
    # For example: "che  un" -> "che è un"
    $line =~ s/\bche  un\b/che è un/g;
}

open my $out, '>:utf8', $file or die "Cannot write $file: $!";
print $out @lines;
close $out;
print "Done running spelling corrections.\n";
