use strict;
use warnings;
use utf8;

my $file = 'TESI.tex';

open my $in, '<:utf8', $file or die "Cannot open $file: $!";
my @lines = <$in>;
close $in;

for my $line (@lines) {
    # Fix words that accidentally got an 'è' instead of 'à' because of the spacing rule
    $line =~ s/\bsociet è\b/società/g;
    $line =~ s/\bmentalit è\b/mentalità/g;
    $line =~ s/\bCreativit è\b/Creatività/g;
    $line =~ s/\bregolarit è\b/regolarità/g;
    $line =~ s/\baffronter è\b/affronterà/g;
    $line =~ s/\bentrer è\b/entrerà/g;
    
    # Fix words that still ended up with '  ' instead of 'è'
    $line =~ s/\bnon  \b/non è /g;
    $line =~ s/\bche  \b/che è /g;
    $line =~ s/\bse  \b/se è /g;
    $line =~ s/\bQuesto  \b/Questo è /g;
    $line =~ s/\bQuesta  \b/Questa è /g;
    $line =~ s/\bci  \b/ciò /g;
    $line =~ s/\bcio  \b/ciò /g;
    
    # More specific space fixes that might have been missed
    $line =~ s/ l'astrazione  rappresentata / l'astrazione è rappresentata /g;
    $line =~ s/ L'obiettivo primario  decostruire / L'obiettivo primario è decostruire /g;
    $line =~ s/ L'interfaccia  divisa / L'interfaccia è divisa /g;
}

open my $out, '>:utf8', $file or die "Cannot write $file: $!";
print $out @lines;
close $out;
print "Done running second spelling corrections.\n";
