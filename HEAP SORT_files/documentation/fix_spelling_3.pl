use strict;
use warnings;
use utf8;

my $file = 'TESI.tex';

open my $in, '<:utf8', $file or die "Cannot open $file: $!";
my @lines = <$in>;
close $in;

my @stems = qw(Responsivit Accessibilit Universalit Longevit fluidit profondit funzionalit 
               Visibilit Identit Priorit Solidit possibilit capacit realt velocit difficolt 
               complessit propriet stabilit modalit attivit visibilit responsabilit usabilit 
               manutenibilit universalit adattabilit reattivit creativit professionalit 
               disponibilit affidabilit potenzialit scalabilit longevit integrit vitalit 
               quantit necessit affinit asincronit complessit entit qualit quantit 
               regolarit societ mentalit);

# Add some uppercase equivalents
push @stems, map { ucfirst($_) } @stems;

for my $line (@lines) {
    for my $stem (@stems) {
        # If the word was incorrectly converted to "stem è "
        $line =~ s/\b$stem\s+è\s+/$stem\à /g;
        
        # If the word is followed by a space
        $line =~ s/\b$stem\s+/$stem\à /g;
        
        # If the word is followed by punctuation
        $line =~ s/\b$stem([.,;:)\]\}])/$stem\à$1/g;
        
        # If it's at the end of the line
        $line =~ s/\b$stem$/$stem\à/g;
    }
    
    # Also fix some other specific isolated errors remaining:
    $line =~ s/\bSe lo  ,\b/Se lo è,\b/g;
    $line =~ s/\bSe lo  \b/Se lo è /g;
    $line =~ s/\bSe lo \b/Se lo è /g if $line =~ /Se lo /; # careful with this
}

# manual fix
for my $line (@lines) {
    $line =~ s/Se lo ,/Se lo è,/g;
    $line =~ s/Se lo  ,/Se lo è,/g;
    $line =~ s/Se lo  /Se lo è /g;
}

open my $out, '>:utf8', $file or die "Cannot write $file: $!";
print $out @lines;
close $out;
print "Done running third spelling corrections.\n";
