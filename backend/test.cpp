#include <cppitertools/range.hpp>  // NOLINT(build/include_order)
#include <cstdint>  // NOLINT(build/include_order)
#include <iostream>  // NOLINT(build/include_order)
#include <string>  // NOLINT(build/include_order)
for(auto i : iter::range(static_cast<int>(std::string{"hell"}.size()))) {
std::cout << i;
std::cout << std::endl;
}
